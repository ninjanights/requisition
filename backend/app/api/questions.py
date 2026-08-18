from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db

from app.schemas.question import (
    QuestionRequest,
    QuestionResponse,
)

from app.services.question_router_service import (
    QuestionRouterService,
    QuestionType,
)

from app.services.sql_generator_service import (
    SQLGeneratorService,
)

from app.services.sql_query_service import (
    SQLQueryService,
)

from app.services.jina_service import (
    JinaEmbeddingService,
)

from app.services.search_service import (
    SearchService,
)

from app.services.gemini_service import (
    GeminiService,
)

router = APIRouter(
    prefix="/api/questions",
    tags=["Questions"],
)


@router.post(
    "",
    response_model=QuestionResponse,
)
async def ask_question(
    request: QuestionRequest,
    db: Session = Depends(get_db),
):

    # 1. Decide SQL or RAG ----------------------------------------------------------

    router_service = QuestionRouterService()

    question_type = await router_service.classify(request.question)

    
    # 2. SQL PATH ----------------------------------------------------------
    

    if question_type == QuestionType.SQL:

        sql_generator = SQLGeneratorService()

        sql = await sql_generator.generate_sql(request.question)

        try:

            query_service = SQLQueryService(db)

            results = query_service.execute(sql)

        except Exception as exc:

            raise HTTPException(
                status_code=400,
                detail=f"Unable to execute generated query: {str(exc)}",
            )

        context = f"""
Generated SQL:

{sql}

Database result:

{results}
"""

    
    # 3. RAG PATH ----------------------------------------------------------
    

    else:

        jina = JinaEmbeddingService()

        query_embedding = await jina.generate_embedding(request.question)

        search_service = SearchService(db)

        results = search_service.search(
            query_embedding=query_embedding,
            limit=5,
        )

        if not results:

            context = "No relevant requisitions were found."

        else:

            context_parts = [result.content for result in results]

            context = "\n\n---\n\n".join(context_parts)

    
    # 4. Gemini final answer ----------------------------------------------------------
    

    gemini = GeminiService()

    answer = await gemini.generate_answer(
        question=request.question,
        context=context,
    )

    
    # 5. Return response ----------------------------------------------------------
    

    return QuestionResponse(
        question=request.question,
        answer=answer,
        source=question_type.value,

    )

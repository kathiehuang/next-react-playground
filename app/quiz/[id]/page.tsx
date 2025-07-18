import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL!, { ssl: { rejectUnauthorized: false } });
import { redirect } from "next/navigation";
import Link from "next/link";

async function Quiz({ id, searchParams }: { id: string, searchParams: { show?: string }}) {
    const answers = await sql`SELECT q.quiz_id, q.title AS quiz_title, q.description AS quiz_description, q.question_text AS quiz_question, a.answer_id, a.answer_text, a.is_correct FROM quizzes AS q JOIN answers AS a ON q.quiz_id = a.quiz_id WHERE q.quiz_id = ${id}`;
    
    return (
        <div className="text-center">
            <h1 className="text-2xl font-bold my-4">
                {answers[0].quiz_title}
            </h1>
            <p className="text-xl text-gray-700">{answers[0].quiz_description}</p>
            <div className="pt-24">
                <p className="text-xl my-4">{answers[0].quiz_question}</p>
                <ul>
                    {answers.map((answer) => (
                        <li key={answer.answer_id}>
                            <p className="my-4">
                                {answer.answer_text}
                                {searchParams.show == 'true' && answer.is_correct && ' ✅'}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default async function QuizPage({ 
    params, 
    searchParams 
}: { 
    params: Promise<{ id: string }>; 
    searchParams: Promise<{ show?: string }>; 
}) {
    // Await the params and searchParams
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    
    return (
        <section>
            <div className="ml-4 mt-4">
                <Link href="/" className="text-md">Home</Link>
            </div>
            <Quiz id={resolvedParams.id} searchParams={resolvedSearchParams} />
            <form action={async () => {
                'use server';
                redirect(`/quiz/${resolvedParams.id}?show=true`);
            }}>
                <div className="text-center">
                    <button className="bg-gray-200 p-2 m-2 rounded hover:bg-gray-300 transition-all">
                        Show answers
                    </button>
                </div>
            </form>
        </section>
    )
}
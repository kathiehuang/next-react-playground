import { revalidatePath } from "next/cache";
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL!, { ssl: { rejectUnauthorized: false } });

function Answer({ id }: { id: number }) {
    return (
        <label htmlFor={`answer-${id}`}>
            Answer {id}
            <input className="bg-gray-50 border border-gray-200 rounded p-1" type="text" name={`answer-${id}`} />
            <input type="checkbox" name={`check-${id}`} />
        </label>
    )
}

export default function QuizForm() {
    async function createQuiz(formData: FormData) {
        "use server";
        let title = formData.get("title") as string;
        let description = formData.get("description") as string;
        let question = formData.get("question") as string;
        let answers: { answer: string | null; isCorrect: boolean }[] = [1, 2, 3].map((id) => {
            return {
                answer: formData.get(`answer-${id}`) as string,
                isCorrect: formData.get(`check-${id}`) === 'on',
            };
        });
        console.log({ answers })
        await sql`
            WITH new_quiz AS (
                INSERT INTO quizzes (title, description, question_text, created_at)
                VALUES (${title}, ${description}, ${question}, NOW())
                RETURNING quiz_id
            )
            INSERT INTO answers (quiz_id, answer_text, is_correct)
            VALUES
                ( (SELECT quiz_id FROM new_quiz), ${answers[0].answer}, ${answers[0].isCorrect}),
                ( (SELECT quiz_id FROM new_quiz), ${answers[1].answer}, ${answers[1].isCorrect}),
                ( (SELECT quiz_id FROM new_quiz), ${answers[2].answer}, ${answers[2].isCorrect});
        `;
        revalidatePath("/");
    } 
    return (
        <form action={createQuiz} className="flex flex-col mt-8 max-w-xs">
            <h3 className="text-lg font-semibold">Create Quiz</h3>
            <label htmlFor="title">
                Title
                <input className="bg-gray-50 border border-gray-200 rounded p-1" type="text" name="title" />
            </label>
            <label htmlFor="description">
                Description
                <input className="bg-gray-50 border border-gray-200 rounded p-1" type="text" name="description" />
            </label>
            <label htmlFor="question">
                Question
                <input className="bg-gray-50 border border-gray-200 rounded p-1" type="text" name="question" />
            </label>
            <div className="my-4"></div>
            <Answer id={1} />
            <Answer id={2} />
            <Answer id={3} />
            <button type="submit" className="bg-gray-50 p-2 m-2 rounded hover:bg-gray-300 transition-all">Create Quiz</button>
        </form>
    )
}
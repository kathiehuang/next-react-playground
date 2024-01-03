import { revalidatePath } from "next/cache";
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL!, { ssl: { rejectUnauthorized: false } });

function Answer({ id }: { id: number }) {
    return (
        <label htmlFor={`answer-${id}`} className="my-2">
            Answer {id}
            <input className="bg-gray-50 border border-gray-300 rounded-lg py-2 px-3 shadow-sm w-80 mx-4 focus:outline-none focus:border-gray-500" type="text" name={`answer-${id}`} />
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
        <form action={createQuiz} className="flex flex-col mt-8 max-w-md content-center mx-auto text-left">
            <h3 className="text-lg font-semibold text-center">New Quiz</h3>
            <label htmlFor="title" className="my-2">
                Title
                <input className="bg-gray-50 border border-gray-300 rounded-lg py-2 mt-1 px-3 shadow-sm w-full focus:outline-none focus:border-gray-500" type="text" name="title" />
            </label>
            <label htmlFor="description" className="my-2">
                Description
                <input className="bg-gray-50 border border-gray-300 rounded-lg py-2 px-3 mt-1 shadow-sm w-full focus:outline-none focus:border-gray-500" type="text" name="description" />
            </label>
            <label htmlFor="question" className="my-2">
                Question
                <input className="bg-gray-50 border border-gray-300 rounded-lg py-2 px-3 mt-1 shadow-sm w-full focus:outline-none focus:border-gray-500" />
            </label>
            <div className="my-4"></div>
            <Answer id={1} />
            <Answer id={2} />
            <Answer id={3} />
            <button type="submit" className="bg-gray-100 p-2 m-2 rounded-lg mb-4 hover:bg-gray-300 transition-all border border-gray-300">Create Quiz</button>
        </form>
    )
}
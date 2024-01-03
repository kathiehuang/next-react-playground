import Image from 'next/image'
import Link from 'next/link'
import postgres from 'postgres'
import { Suspense } from 'react';
import QuizForm from './quiz-form';

const sql = postgres(process.env.DATABASE_URL!, { ssl: { rejectUnauthorized: false } });

async function Quizzes() {
  const quizzes = await sql`SELECT * FROM quizzes`;
  return (
    <ul>
      {quizzes.map((quiz) => (
        <li key={quiz.quiz_id} className="hover:font-semibold mb-2">
          <Link href={`/quiz/${quiz.quiz_id}`}>{quiz.title}</Link>
        </li>
      ))}
    </ul>
  )
}

export default function Home() {
  return (
    <section className="flex items-center justify-center w-full content-center " >
      <div className="mx-auto w-full justify-center items-center content-center">
        <h1 className="text-2xl font-semibold my-4 text-center">All Quizzes</h1>
        <div className="w-full justify-center items-center content-center text-center mx-auto">
          <Suspense fallback={<p>Loading...</p>}>
            <Quizzes />
            <QuizForm />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
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
        <li key={quiz.quiz_id} className="underline">
          <Link href={`/quiz/${quiz.quiz_id}`}>{quiz.title}</Link>
        </li>
      ))}
    </ul>
  )
}

export default function Home() {
  return (
    <section>
      <h1 className="text-2xl font-semibold">All Quizzes</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <Quizzes />
        <QuizForm />
      </Suspense>
    </section>
  )
}
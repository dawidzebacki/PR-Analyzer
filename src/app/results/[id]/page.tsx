interface ResultsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { id } = await params;

  return (
    <main className="flex flex-1 items-center justify-center">
      <h1 className="font-heading text-4xl font-bold text-navy">
        Results for {id}
      </h1>
    </main>
  );
}

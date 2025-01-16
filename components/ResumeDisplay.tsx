interface ResumeDisplay {
  resume: any;
}

export function ResumeDisplay({ resume }: ResumeDisplay) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <pre className="whitespace-pre-wrap overflow-x-auto font-mono text-sm text-[#484848]">
        {JSON.stringify(resume, null, 2)}
      </pre>
    </div>
  );
}

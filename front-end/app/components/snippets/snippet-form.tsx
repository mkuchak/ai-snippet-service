import { useState } from "react";
import { Form, useActionData, useNavigation } from "react-router";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface SnippetFormProps {
  onCancel?: () => void;
}

export function SnippetForm({ onCancel }: SnippetFormProps) {
  const [text, setText] = useState("");
  const actionData = useActionData() as { error?: string } | undefined;
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">
        Summarize Your Content
      </h2>

      <Form method="post" className="space-y-4">
        {actionData?.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {actionData.error}
          </div>
        )}

        <Textarea
          name="text"
          label="Raw Content"
          placeholder="Paste your raw content here... (blog drafts, meeting transcripts, research notes, articles, etc.)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={12}
          required
        />

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={!text.trim() || isSubmitting}>
            {isSubmitting ? "Generating..." : "Generate AI Summary"}
          </Button>

          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>

        <div className="bg-slate-50 rounded p-4 text-sm text-slate-600">
          <p className="font-medium mb-2">💡 Pro Tips:</p>
          <ul className="space-y-1">
            <li>• Works great with blog drafts, meeting transcripts, and research notes</li>
            <li>• The longer your content, the more valuable the AI summary becomes</li>
            <li>• Generated summaries are perfect for emails, presentations, and reports</li>
          </ul>
        </div>
      </Form>
    </div>
  );
}

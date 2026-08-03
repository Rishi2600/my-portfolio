// lucide-react removed all brand/logo icons (Github, Linkedin, Twitter, etc.)
// starting in its 1.x line — they're trademarked logos and were dropped
// rather than renamed. These two small inline SVGs replace them so the
// Contact section doesn't depend on lucide shipping brand marks at all.

export function GithubIcon({ size = 20, strokeWidth = 1.75, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <path d="M15 22v-4.06c.06-.76-.19-1.51-.7-2.09 2.5-.29 5.2-1.31 5.2-5.67a4.42 4.42 0 0 0-1.13-3.03 4.2 4.2 0 0 0-.09-3.11s-.94-.29-3.08 1.16a10.32 10.32 0 0 0-5.4 0C7.66 3.9 6.72 4.19 6.72 4.19a4.2 4.2 0 0 0-.09 3.11A4.42 4.42 0 0 0 5.5 10.33c0 4.34 2.7 5.36 5.2 5.67-.5.57-.76 1.32-.7 2.07V22" />
      <path d="M9 20c-3 .973-5.5 0-7-3" />
    </svg>
  );
}

export function LinkedinIcon({ size = 20, strokeWidth = 1.75, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

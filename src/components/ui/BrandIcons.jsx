// lucide-react removed all brand/logo icons (Github, Linkedin, Twitter, etc.)
// starting in its 1.x line — they're trademarked logos and were dropped
// rather than renamed. These small inline SVGs replace them so the
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

export function XIcon({ size = 20, strokeWidth, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      {...rest}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
    </svg>
  );
}

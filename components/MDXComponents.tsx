import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="mt-12 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
      {children}
    </h1>
  ),

  h2: ({ children }) => (
    <h2 className="mt-14 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
      {children}
    </h2>
  ),

  h3: ({ children }) => (
    <h3 className="mt-10 text-2xl font-semibold tracking-tight text-gray-900">
      {children}
    </h3>
  ),

  p: ({ children }) => (
    <p className="mt-7 max-w-3xl text-[17px] leading-8 text-gray-700 md:text-lg md:leading-9">
      {children}
    </p>
  ),

  strong: ({ children }) => (
    <strong className="font-semibold text-gray-900">
      {children}
    </strong>
  ),

  em: ({ children }) => (
    <em className="text-gray-800">
      {children}
    </em>
  ),

  a: ({ href, children }) => (
    <a
      href={href}
      className="font-medium text-yellow-600 underline decoration-yellow-300 underline-offset-4 transition-colors hover:text-yellow-700"
    >
      {children}
    </a>
  ),

  ul: ({ children }) => (
    <ul className="mt-7 max-w-3xl list-disc space-y-3 pl-7 text-[17px] leading-8 text-gray-700 md:text-lg md:leading-9">
      {children}
    </ul>
  ),

  ol: ({ children }) => (
    <ol className="mt-7 max-w-3xl list-decimal space-y-3 pl-7 text-[17px] leading-8 text-gray-700 md:text-lg md:leading-9">
      {children}
    </ol>
  ),

  li: ({ children }) => (
    <li className="pl-2">
      {children}
    </li>
  ),

  blockquote: ({ children }) => (
    <blockquote className="my-10 max-w-3xl border-l-4 border-yellow-500 bg-yellow-50 px-6 py-6 text-lg italic leading-8 text-gray-700 md:px-8 md:text-xl">
      {children}
    </blockquote>
  ),

  hr: () => (
    <hr className="my-14 max-w-3xl border-gray-200" />
  ),

  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt || ""}
      className="my-10 block h-auto max-h-[650px] w-full max-w-3xl rounded-2xl object-contain"
    />
  ),

  table: ({ children }) => (
    <div className="my-10 max-w-full overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full min-w-[600px] border-collapse text-left text-sm">
        {children}
      </table>
    </div>
  ),

  thead: ({ children }) => (
    <thead className="bg-gray-50">
      {children}
    </thead>
  ),

  tbody: ({ children }) => (
    <tbody>{children}</tbody>
  ),

  tr: ({ children }) => (
    <tr className="border-b border-gray-200 last:border-b-0">
      {children}
    </tr>
  ),

  th: ({ children }) => (
    <th className="px-5 py-4 font-semibold text-gray-900">
      {children}
    </th>
  ),

  td: ({ children }) => (
    <td className="px-5 py-4 text-gray-700">
      {children}
    </td>
  ),
};
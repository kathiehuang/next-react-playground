export default function NestedLayout({ children, }: {
    children: React.ReactNode;
}) {
    return (
        <nav>
            {children}
        </nav>
    )
}
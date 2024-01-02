export default function NestedLayout({ children, }: {
    children: React.ReactNode;
}) {
    return (
        <nav>
            This is my navigation
            {children}
        </nav>
    )
}
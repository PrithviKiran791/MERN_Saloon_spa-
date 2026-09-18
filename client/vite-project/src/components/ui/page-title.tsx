export function PageTitle({ title }: Readonly<{ title: string }>) {
    return <h1 className="page-heading text-xl text-primary">{title}</h1>;
}

export default PageTitle;
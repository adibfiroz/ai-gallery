import GoToTop from "./goToTop"

interface ContainerProps {
    children: React.ReactNode
}

const Container: React.FC<ContainerProps> = ({
    children
}) => {
    return (
        <div className="container mx-auto p-4">
            {children}
            <GoToTop />
        </div>
    )
}

export default Container
import { ReactComponent as Spinner } from '../assets/svg/loader.svg'

type IProps = {
    loadingState: boolean
}

const Loader: React.FC<IProps> = ({ loadingState }) => {
    console.log(loadingState)
    return loadingState ? (
        <div className="loader-container">
            <Spinner />
        </div>
    ) : null
}

export default Loader

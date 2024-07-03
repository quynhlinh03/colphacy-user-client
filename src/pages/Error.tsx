import { useNavigate, useRouteError } from 'react-router-dom'
import { Button, Flex, rem } from '@mantine/core'

interface ErrorInfo {
    statusText?: string;
    message?: string;
}

export default function ErrorPage() {
    const error: ErrorInfo = useRouteError()
    const navigate = useNavigate()
    return (
        <Flex direction="column" align="center" justify="start" mih={rem('100vh')} maw={rem('100vw')} id="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
            <Button onClick={() => { navigate('/') }}>Back to home page!</Button>
        </Flex>
    )
}
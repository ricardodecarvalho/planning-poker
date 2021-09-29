import React from "react"

const classes = 'fixed-top w-100 vh-100 d-flex bg-white justify-content-center align-items-center'

function PointCustom({ onAbort, onSubmit }: any) {
    const [pointCustom, setPointCustom] = React.useState<string>('')

    function handlePointCustom(event: any) {
        const value = event.target.value
        if (value.length <= 3) {
            setPointCustom(value)
        }
    }

    function handleSubmit(event: any) {
        event.preventDefault();
        onSubmit(pointCustom)
        onAbort()
    }

    return (
        <div
            className={classes}
        >
            <form onSubmit={handleSubmit}>
                <input type='text' value={pointCustom} onChange={handlePointCustom} />
                <input type='submit' value='Enviar' />
                <input type='button' value='Cancelar' onClick={onAbort} />
            </form>
        </div>
    )
}

export default PointCustom

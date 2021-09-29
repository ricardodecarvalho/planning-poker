import React from "react"

const classes = 'fixed-top w-100 vh-100 d-flex bg-white justify-content-center align-items-center'


function PointCustom({ onAbort, onSubmit }: any) {
    const refInput = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        if (refInput.current) {
            refInput.current.focus()
        }
    }, [])

    const [pointCustom, setPointCustom] = React.useState<string>('')

    function handlePointCustom(event: any) {
        const value = event.target.value
        if (value.length <= 3) {
            setPointCustom(value)
        }
    }

    function handleSubmit(event: any) {
        event.preventDefault();
        if (pointCustom !== '') {
            onSubmit(pointCustom)
            onAbort()
        } else if (refInput.current) {
            refInput.current.focus()
        }
    }

    function handleKeyDown(event: any) {
        if (event.keyCode === 27) {
            onAbort()
        }
    }

    return (
        <div
            className={classes} onKeyDown={handleKeyDown}
        >
            <form onSubmit={handleSubmit}>
                <input
                    ref={refInput}
                    type='text'
                    className='form-control'
                    value={pointCustom}
                    onChange={handlePointCustom}
                />
                <input type='submit' className='btn btn-primary' value='Salvar' />
                <input type='button' className='btn btn-danger' value='X' onClick={onAbort} />
            </form>
        </div>
    )
}

export default PointCustom

import React from 'react'

import PointCustom from './PointCustom'

import 'bootstrap/dist/css/bootstrap.min.css'

const globalAny: any = global;

globalAny.jQuery = require('jquery')
require('bootstrap')

const initialState = {
    points: [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
    ]
}

function App(): JSX.Element {
    const [showCard, setShowCard] = React.useState<boolean>(false)
    const [text, setText] = React.useState<string>('')
    const [points] = React.useState<string[] | []>(initialState.points)
    const [showCustom, setShowCustom] = React.useState<boolean>(false)


    const classes = 'fixed-top w-100 vh-100 d-flex bg-white justify-content-center align-items-center'

    function ShowCard(): JSX.Element {
        const handleOnClick = () => {
            setText('')
            setShowCard(false)
        }

        return (
            <div
                className={classes}
                onClick={handleOnClick}
            >
                <p className='' style={{ fontSize: '15rem' }}>{text}</p>
            </div>
        )
    }

    function handleOnAbortPointCustom() {
        setShowCustom(false)
    }

    function handleOnSubmitPointCustom(value: never) {
        if (points.indexOf(value) === -1) {
            points.push(value)
        }

        // setPoints
    }

    return (
        <>
            <div className='container'>
                <div className='card mt-3'>
                    <div className="card-body">
                        {points.map((point: string, index: number) => (
                            <button
                                key={index}
                                type='button'
                                className='btn btn-light btn-lg'
                                onClick={() => {
                                    setText(point)
                                    setShowCard(true)
                                }}
                            >
                                {point}
                            </button>
                        ))}

                        <button
                            type='button'
                            className='btn btn-light btn-lg'
                            onClick={() => {
                                setShowCustom(true)
                                setText('')
                                setShowCard(false)
                            }}
                            disabled={points.length >= 20}
                        >
                            Personalizar
                        </button>
                    </div>
                </div>
            </div>
            {showCard && <ShowCard />}
            {showCustom && <PointCustom onAbort={handleOnAbortPointCustom} onSubmit={handleOnSubmitPointCustom} />}
        </>
    );
}

export default App;

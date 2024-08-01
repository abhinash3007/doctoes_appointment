import React from 'react'

const Hero = ({ title, imageUrl }) => {
    return (
        <div>
            <div className="hero container">
                <div className="banner">
                    <h1>{title}</h1>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod, esse temporibus earum fuga asperiores repellendus facere, sapiente dolor nisi quas hic praesentium repellat alias doloremque, culpa ab. Esse, blanditiis facere.</p>
                </div>
                <div className="banner">
                    <img src={imageUrl} alt='hero' className='animated-image' />
                    <span>
                        <img src='/vector.png' alt='vector'/>
                    </span>
                </div>
            </div>

        </div>
    )
}

export default Hero

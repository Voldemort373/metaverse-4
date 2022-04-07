import { useState, useEffect } from 'react';

const Plot = ({ position, size, landId, landInfo, setLandName, setLandOwner, setHasOwner, setLandId }) => {
    const [color, setColor] = useState("white")
    const clickHandler = () => {
        setLandName(landInfo.name)
        setLandId(landId)

        if (landInfo.owner === '0x0000000000000000000000000000000000000000') {
            setLandOwner('No Owner')
            setHasOwner(false)
        } else {
            setLandOwner(landInfo.owner)
            setHasOwner(true)
        }
        if (color === "white"){
        	setColor("blue")
        }else{
        	setColor("white")
        }
    }

    return (
        <mesh position={position} onClick={clickHandler}>
            <planeBufferGeometry attach="geometry" args={size} />
            <meshStandardMaterial color={color} metalness={10} roughness={0} />
        </mesh>
    );
}

export default Plot;
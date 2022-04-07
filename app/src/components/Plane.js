const Plane = () =>{
	return(
		// mesh x,y,z
		<mesh position={[0,0,0]}>
			{/*args: width and height of plane*/}
			<planeBufferGeometry attach="geometry" args={[1000,1000]} />
			<meshStandardMaterial color={"#404040"} />
		</mesh>
	)
}



export default Plane;
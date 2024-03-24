function Logo() {
      return (
        <>
            <div className="w-full flex flex-col items-center justify-center mt-8 mb-2">
                <img src={`${process.env.PUBLIC_URL}/logo_transp.png`} alt="Bank Logo"/>
            </div>
        </>
      );
}

export default Logo;
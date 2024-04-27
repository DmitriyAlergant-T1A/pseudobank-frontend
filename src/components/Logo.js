function Logo({ userProfile }) {
  
      return (
        <>
          <div className = "flex top-0 y-0 z-50">
            <div className="w-full flex items-center justify-center mt-8 mb-2">
              <div className=""></div>
              <div>
                <img src={`${process.env.PUBLIC_URL}/logo_transp.png`} alt="Bank Logo" />
              </div>


              { userProfile && (
              <div className="flex-1 flex justify-end items-end">
                <div className="text-lg gap-2 items-center items-end">
                  <img src={userProfile.picture} alt="User" className="inline-block h-16 w-16 rounded-full ml-2 p-2" />
                  <span>{userProfile.name} <a href="/logout" className="text-gray-500 p-4">[logout]</a></span>
                </div>
              </div>
              )}
            </div>
          </div>
        </>
      );
}

export default Logo;
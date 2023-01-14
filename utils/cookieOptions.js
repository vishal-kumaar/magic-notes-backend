const cookieOptions = {
    expires: new Date(Data.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true,
}

export default cookieOptions;
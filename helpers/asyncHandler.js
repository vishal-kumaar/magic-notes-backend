// export const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next);
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

export function asyncHandler(fn){
    return async function(){
        try {
            await fn(req, res, next);
        } catch (error) {
            
        }
    }
}
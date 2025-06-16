export const errorHandler = (res, statusCode, message, data)=>{
      return res.status(statusCode || 500).json({
            success:false,
            message:message || "Internal Server Error",
            data: data || {}
      })
}
/*
    parses the unique constraint-related error object and constructs an appropriate
    error message (handling errors that are thrown because of a Mongoose validator
    violation of the 'unique' constraint)
*/
const getUniqueErrorMessage = (err) => {
    let output
    try {
        let fieldName =   
        err.message.substring(err.message.lastIndexOf('.$') + 2,                                             
        err.message.lastIndexOf('_1'))
        output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) +   
        ' already exists'
    } catch (ex) {
        output = 'Unique field already exists'
    }
    return output
  }

/*  
    parses and returns the error message associated with the specific validation error 
    returned by MongoDB query attempt using Mongoose 
*/
const getErrorMessage = (err) => {
    let message = ''
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = getUniqueErrorMessage(err)
                break
            default:
                message = 'Something went wrong'
        }
    } else {
        for (let errName in err.errors) {
            if (err.errors[errName].message)
            message = err.errors[errName].message
        }
    }
    return message
  }
  
  export default {getErrorMessage}
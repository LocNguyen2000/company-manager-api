export const getEmployeeById = async (req, res) => {
    try {
        

    } catch (error) {
        console.log(error.message);
        return res.status(500).json("Something is wrong with server")
    }
}

export const addEmployee = async (req, res) => {
    try {
     
    } catch (error) {
        console.log(error.message);
        return res.status(400).json("Something is wrong with server")
    }
}

export const addEmployeeWithCustomerBatch = async (req, res) => {
    
    try {
       
        
    } catch (error) {
        console.log(error.message);
        return res.status(400).json("Something is wrong with server")
    }
}


export const updateEmployee = async (req, res) => {
    try {
      
    } catch (error) {
        console.log(error.message);
        return res.status(500).json("Something is wrong with server")
    }
}

export const deleteEmployee = async (req, res) => {
    try {
       

    } catch (error) {
        console.log(error.message);
        return res.status(500).json("Something is wrong with server")
    }
}
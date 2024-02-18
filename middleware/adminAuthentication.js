
const isAdminLogin = async (req, res, next) => {

    try {

        if(req.session.user_id){
            res.redirect('/');
        }
        else if (!req.session.admin_id) { 
            res.redirect('/admin');
        }
        
            next();
        
    } catch (error) {
        console.log(error.message);
    }

}

const isAdminLogout = async (req, res, next) => {
    
    try {

        if(req.session.user_id){
            res.redirect('/');
        }
        else if (req.session.admin_id) {

            return res.redirect('/admin/adminHome');
            
        }else{
            next();
        }
            
        
       
    } catch (error) {
        console.log(error.message);
    }

}

module.exports = {
    isAdminLogin,
    isAdminLogout
}
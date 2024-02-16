const isAdminLogin = async (req, res,next) => {

    try {
        
        if(req.session.user_id){}
        else{
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
            res.redirect('/admin/adminHome');
        }
        next();
    } catch (error) {
        console.log(error.message);
    }

}

module.exports = {
    isAdminLogin,
    isAdminLogout
}
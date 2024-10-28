const Role = {
    KASIR : "kasir",
    MANAJER : "manajer",
    ADMIN : "admin"
};


export const adminOnly = async (req, res, next) => {
    try {
        if(req.decoded.role === Role.ADMIN){
            next();
        } else {
            res.status(403).json({ msg: 'Access forbidden' });
        }
    } catch (error) {
        console.log(error);
        return res.status(403).json({ msg: 'Access forbidden' });
    }
};

export const manajerOnly = async (req, res, next) => {
    try {
        if(req.decoded.role === Role.MANAJER){
            next();
        } else {
            res.status(403).json({ msg: 'Access forbidden' });
        }
    } catch (error) {
        console.log(error);
        return res.status(403).json({ msg: 'Access forbidden' });
    }
};

export const kasirOnly = async (req, res, next) => {
    try {
        if(req.decoded.role === Role.KASIR){
            next();
        } else {
            res.status(403).json({ msg: 'Access forbidden' });
        }
    } catch (error) {
        console.log(error);
        return res.status(403).json({ msg: 'Access forbidden' });
    }
};

export const authUserParams = async (req, res, next) => {
    try {
        const { id_user } = req.params;
        const role = req.decoded.role;
        const userId = req.decoded.id_user;
        const idUserFromParams = parseInt(id_user, 10);

        if (role === 'admin') {
            return next();
        }

        if (role === 'manajer' && idUserFromParams === userId) {
            return next();
        }
        
        if(role === 'kasir' && idUserFromParams === userId) {
            return next();
        }

        return res.status(403).json({ 
            msg: 'Access forbidden! You do not have permission.',
        });
        
    } catch (error) {
        console.error('Error checking permissions:', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

export const authGetUserQuery = (req, res, next) => {
    try {
        const role = req.decoded.role;

        // Tentukan kondisi pencarian berdasarkan peran pengguna
        let queryConditions = {};
        if (role === 'admin') {
            // Jika role admin, tidak ada filter 
            queryConditions = {};
        } else if (role === 'manajer') {
            // jika role manajer, hanya bisa melihat kasir
            queryConditions = { role: 'kasir' };
        } else {
            // Jika role tidak dikenal, return 403 Forbidden
            return res.status(403).json({
                msg: 'Access denied'
            });
        }

        // Simpan `queryConditions` di `req` agar dapat digunakan dalam handler
        req.queryConditions = queryConditions;
        next(); // Lanjut ke handler berikutnya
    } catch (error) {
        console.error('Error in setQueryConditions middleware:', error);
        res.sendStatus(500);
    }
};

export const MeTransactionQuery = async (req, res, next) => {
    const { id_user, role } = req.decoded;

    if (!id_user || !role) {
        return res.status(401).json({ msg: 'Unauthorized access' });
    }

    const intIdUser = parseInt(id_user, 10);

    try {
        let queryConditions = {};
        if (role === Role.KASIR) {
            queryConditions = { id_user: intIdUser };
        } else {
            return res.sendStatus(204);
        }

        req.queryConditions = queryConditions;
        next();
    } catch (error) {
        console.error('Error in setQueryConditions middleware:', error);
        res.sendStatus(500);
    }
};


export const kasirAndManajerOnly = async (req, res, next) => {
    const { role } = req.decoded;
    try {
        if (role === Role.KASIR || role === Role.MANAJER) {
            next();
        } else {
            res.status(403).json({ msg: 'Access Denied'})
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
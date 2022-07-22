// const {Router} = require('express');
// const {check,validationResult} = require('express-validator');
// const User = require('../models/User');
// const router = Router();

// router.post(
//     '/update',
//     [
//         check('password','Мінімальна довжина 6 символів').isLength({min: 6}),
//         check('password','Максимальна довжина 20 символів').isLength({max: 20})
//     ],
//     async (req, res) => {
//     try {
//         const errors=validationResult(req);
//         if(!errors.isEmpty()){
//             return res.status(400).json({errors:errors.array(),message:'Некоректний пароль'})
//         }

//         const {token, oldpassword, newpassword}=req.body;

//         const candidate = await User.findById(req.token.userId);

//         if(oldpassword != candidate.password){
//             return res.status(400).json({message:'Невірний пароль'});
//         }
//         const UpdateUser = User.findByIdAndUpdate({_id: req.token.userId},{password: newpassword})
//         await UpdateUser.save();
//         res.status(201).json({message:'Пароль змінено'});
//     } catch (e) {
//         res.status(500).json({message:'Щось не то'});
//     }
// })

// module.exports = router;

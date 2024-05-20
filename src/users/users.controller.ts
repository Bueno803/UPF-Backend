import { Body, Controller, Get, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import PassengerAuth from 'src/models/authuser.model';
import Passenger from 'src/models/user.model';

export default interface ICreatePassengerAuthModel {
    id?: string;
    email: string;
    phoneNumber: string;
    password: string;
}

// export default interface UserPassengerConfig {
//     id?: string;
//     uid: string;
//     email: string;
//     phoneNumber: string;
// }

@Controller('users')
export class UsersController {
    
    constructor(private usersService: UsersService) {}

    @Get('/all')
    async getUsers(@Res() response) {
        try {
            const users = await this.usersService.getAllUsers();
            console.log("users: ", users);
            if (users) {
                // users
                return response.status(HttpStatus.OK).json({
                    message: 'Users found successfully', 
                    users
                })
            } else {
                // no users?
                return response.status(HttpStatus.NOT_FOUND).json({
                    message: 'No users found',
                    users
                })
            }
        } catch (error) {
            return response.status(error.status).json("Error: ", error.response)
            
        }
    }

    @Post('/auth-create')
    async createAuthUser(@Res() response, @Body() authUserDto: ICreatePassengerAuthModel): Promise<PassengerAuth> {
        // To-Do
        console.log("post /auth-create");
        try {
            const {email, phoneNumber, password} = authUserDto;
            await this.usersService.createUserWithEmailPassword(email, phoneNumber, password)
            .then((resData) => {
                console.log("resData: ", resData);

                if(resData.code != null) {
                    const userReturn = resData;
                    console.log("what is this: ", userReturn);
                    switch (resData.code) {
                        case 'auth/email-already-exists':
                        console.log();
                            return response.status(HttpStatus.OK).json({
                                errorStatusCode: 1,
                                message: `Email address ${email} already in use.`, 
                                resData
                            });
                        case 'auth/phone-number-already-exists':
                        console.log();
                            return response.status(HttpStatus.OK).json({
                                errorStatusCode: 2,
                                message: `Phone number ${phoneNumber} already in use.`, 
                                resData
                            });
                        case 'auth/invalid-email':
                            console.log();
                            return response.status(HttpStatus.OK).json({
                                errorStatusCode: 3,
                                message: `Email address ${email} is invalid.`, 
                                resData
                            });
                        case 'auth/operation-not-allowed':
                            // console.log(`Error during sign up.`);
                            return response.status(HttpStatus.UNAUTHORIZED).json({
                                errorStatusCode: 4,
                                message: `Error during sign up.`, 
                                resData
                            });
                        case 'auth/invalid-password':
                            return response.status(HttpStatus.OK).json({
                                errorStatusCode: 5,
                                message: 'Password is not strong enough. Add additional characters including special characters and numbers.', 
                                resData
                            });
                        default:
                            console.log(resData.message);
                            // console.log(user);
                            return response.status(HttpStatus.OK).json({
                                isError: false,
                                message: 'User Successfully Created', 
                                resData
                            });
                    }
                } else {
                    return response.status(HttpStatus.OK).json({
                        isError: false,
                        message: 'User Successfully Created', 
                        resData
                });
                }
                });
                // console.log ("rD: ", returnData);
        } catch (error) {
            console.log("error: ", error)
        }
        return null;
    }

    @Post('/create')
    async createUser(@Res() response, @Body() userDto: Passenger): Promise<Passenger> {
        // To-Do
        console.log("post /create");
        try {
            console.log("User Dto: ", userDto);
            const {uid, email, phoneNumber, displayName, isActive, creationTime, lastLoggedIn} = userDto;
            await this.usersService.createUserInDb(uid, email, phoneNumber, displayName, isActive, creationTime, lastLoggedIn)
            .then((resUser) => {
                console.log("resUser: ", resUser);

                if(resUser == null) {
                    return response.status(HttpStatus.CONFLICT).json({
                        message: 'An account exists with that email'
                    });
                } else {
                    return response.status(HttpStatus.OK).json({
                        message: 'User successfully created',
                        resUser
                    });
                }
            });
        } catch (error) {
            console.log("error: ", error)
        }
        return null;
    }

    @Post('/loggin-update')
    async userLogginTimeUpdate(@Res() response, @Body() userDto: {uid: string,lastLoggedIn: Date}): Promise<Passenger> {
        // To-Do
        console.log("post /loggin-update");
        try {
            console.log("User Dto: ", userDto);
            const {uid, lastLoggedIn } = userDto;
            const user = await this.usersService.updateUserTimeStamp(uid, lastLoggedIn);
            console.log(user);
            return response.status(HttpStatus.OK).json({
                message: 'Users updated successfully',
                user
            })
        } catch (error) {
            console.log("error: ", error)
        }
        return null;
    }

    @Post('/update-phone')
    async userPhoneUpdate(@Res() response, @Body() userDto: {uid: string, phoneNumber: string}): Promise<Passenger> {
        // To-Do
        console.log("post /update-phone");
        try {
            console.log("User Dto: ", userDto);
            const {uid, phoneNumber } = userDto;
            const user = await this.usersService.updateUserPhone(uid, phoneNumber);
            console.log("userPhoneUpdate first: ", user);
            return response.status(HttpStatus.OK).json({
                message: 'Users updated successfully',
                user
            })
        } catch (error) {
            console.log("error: ", error)
        }
        return null;
    }
}

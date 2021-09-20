import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from 'dotenv';
import indexRouter from './routes/indexRouter';
import registerRouter from './routes/userRouter';
import loginRouter from './routes/loginRouter';
import aboutRouter from './routes/aboutRouter';
import memberRouter from './routes/memberRouter';
import locationRouter from './routes/locationRouter';
import loginUserRouter from './routes/loginUsersIndexRouter';
import logOutRouter from './routes/logoutRouter';
import plantRouter from './routes/planRouter';
import locationRouter2 from './routes/locationRouter2';
import planRouter2 from './routes/plan2Router';
import { run } from './db/mongoose';

dotenv.config();
const app = express();

run()
// view engine setup
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/location-selection', locationRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/about', aboutRouter);
app.use('/holidayresort', indexRouter);
app.use('/membership', memberRouter);
app.use('/loginusers', loginUserRouter);
app.use('/logout', logOutRouter);
app.use('/plan', plantRouter);
app.use('/location-selection2', locationRouter2);
app.use('/plan2', planRouter2);


app.use('/holidayresort', indexRouter);

app.use(function (req, res, next) {
  next(createError(404));
});
// error handler
app.use(function (
  err: createError.HttpError,
  req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  res.status(err.status || 500);
  res.render('error');
});

const port = 3100

app.listen(port, () => { console.log(`Server is running on ${port}`)});
export default app;

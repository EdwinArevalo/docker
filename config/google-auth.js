const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function(user, done) {
  //done(null, user.id);
  done(null, user);
});

//passport.deserializeUser(function(id, done) {
passport.deserializeUser(function(user, done) {
  /*
  User.findById(id, function(err, user) {
    done(err, user);
  });
  */
  done(null, user);
});


passport.use(new GoogleStrategy({
    clientID: "1087979620982-3lve8gmmkedpfqcn0hcju54s24coph5d.apps.googleusercontent.com",
    clientSecret: "_qlyucbpsETJd3dxK9Hw_Bd0",
    callbackURL: "http://localhost:8080/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    //
  /*
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
    */
   return done(null, profile);
  }
));
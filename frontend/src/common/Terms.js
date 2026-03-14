import React from "react";
import Typography from "@material-ui/core/Typography/Typography";
import withStyles from "@material-ui/core/styles/withStyles";


const styles = (theme) => ({
  root: {
    padding: theme.spacing(1),
  },
  text: {
    marginBottom: 12,
  }
});

@withStyles(styles, {withTheme:true})
class Terms extends React.Component {
  render() {
    const {classes} = this.props;

    return (
      <div className={classes.root}>
        <Typography variant="h2" className={classes.text}>
          Terms &amp; Conditions
        </Typography>
        <Typography variant="body1" className={classes.text}>
          Your privacy is important. This page tells you what data this website gathers about you and how it is used. This page is designed to be clear and easy to understand.
        </Typography>
        <Typography variant="body1" className={classes.text}>
          <strong>Who Are We?</strong><br/>
          This website is owned by Organized Play Kraków, a private group of players from Krakow, Poland.
        </Typography>
        <Typography variant="body1" className={classes.text}>
          <strong>Data We Gather</strong><br/>
          We gather very little personal data about you, and we do not share what we gather with anybody. The only mandatory personal data this site gathers about you are:
          <ul>
            <li>Your first and last name</li>
            <li>Your email address</li>
            <li>Your IP address</li>
            <li>Your securely encrypted password</li>
          </ul>
          This data is stored for security purposes (to combat spam, and to protect users from harassment), to provide web service features and is not shared with any other person, service, site, or organization outside the service.<br/>
          We do not gather or use any biographical or financial data about you; nor do we store payment information, credit card information, or bank details.
          <br/>
          We store your registration IP address, and any IP addresses that you have posted from. Your IP address does not reveal your name, home address, or actual physical location. You can see what your IP address tells us about you here.
          <br/>
          We are not able to read your password.
          <br/>
          We store this data until you delete your account.
        </Typography>
        <Typography variant="body1" className={classes.text}>
          <strong>Cookies</strong><br/>
          This site uses cookies. These are tiny files stored on your computer so that the site can respond correctly to your activity (for example, by keeping you logged in when you revisit). These cookies are not stored on the site's servers, but rather on your own device, and you can delete or block them at any time. However, if you do choose to block our cookies, some features of the site will not work correctly for you.
        </Typography>
        <Typography variant="body1" className={classes.text}>
          <strong>Your Profile</strong><br/>
          Your profile is yours, and it contains as much or as little information as it is needed to run service functionality. The website do not share your e-mail address with other users. You can edit or remove this information at any time.
          <br/>
          This site does not use that information in any way but to display it on your profile page.<br/>
          This information is not shared with any other person, service, site, or organization, except that it is displayed publicly to the other users on your profile page. This site does not use that information for marketing purposes.
        </Typography>
        <Typography variant="body1" className={classes.text}>
          <strong>E-mails</strong><br/>
          We send only information about games that you sign up for or create.
        </Typography>
        <Typography variant="body1" className={classes.text}>
          <strong>Other Organizations</strong><br/>
          This site interacts with some other organizations and services (third-party processors) as follows. They will have their own privacy polices, which you should monitor.
          <ul>
            <li>Social network logins. If you register for this site via a social network such as Facebook, Twitter, Google+, or Reddit, we obtain (with your permission) from that website your username and email address to create your account. We do not pass any information to the social network.</li>
            <li>Google. Google may serve you ads based on your browsing history or other demographic data it may hold about you. We do not have access to that individual data. Additionally, Google provides us, via the Google Analytics service, aggregate, non-identifiable, anonymous data about overall visitor demographics, but it does not share with us any information about individual users. For example, we may know that 67% of our visitors are female*, but we don't know whether you are one of those 67%. You can find Google's privacy policy here, and can opt out of Analytics here.</li>
          </ul>
        </Typography>
        <Typography variant="body1" className={classes.text}>
          <strong>Where Your Data Is Stored</strong><br/>
          Your data is stored on a webserver in Poland.
        </Typography>
        <Typography variant="body1" className={classes.text}>
          <strong>Deleting Your Information</strong><br/>
          You can delete or change information on your profile at any time. You can also change your nickname.<br/>
          If you wish to delete your account, please contact us at <strong>dndalkrakow@gmail.com</strong> from your regiestered account address. Note that this is irreversible; you will not be able to recover the account. This will remove any personal information (as described above) that we store about you, along with your user profile.
        </Typography>
        <Typography variant="body1" className={classes.text}>
          <strong>Requesting Your Information</strong><br/>
          While this website stores very little data about you, you have a right to a copy of any data this site stores about you. This is comprised of your nickname, email address and any IP addresses we have stored for you. You may request a copy of this information by sending an e-mail to our data administrator at <strong>dndalkrakow@gmail.com</strong>.  (this will enable us to meet our obligation to ensure that the request is valid). You will receive that data within 30 days by e-mail.
        </Typography>
      </div>
    )
  }
}

export default Terms;

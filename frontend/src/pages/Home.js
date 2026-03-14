import React, {Fragment} from 'react';
import {inject, observer} from "mobx-react";
import {CurrentDMGamesList, CurrentUserGamesList} from "./GamesList";
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import UndecoratedLink from "../common/UndecoratedLink";
import classNames from 'classnames';
import cover from '../images/dnd_cover.jpg';


import {faDiscord, faFacebook} from '@fortawesome/free-brands-svg-icons'
import {faFile, faFilePdf} from '@fortawesome/free-regular-svg-icons'
import Divider from "@material-ui/core/Divider/Divider";
import {openUrl} from "../utils";
library.add(faFacebook, faDiscord, faFilePdf, faFile);
//homepage displaying when user isn't logged in
const styles = (theme) => ({
  communityIcon: {
    fontSize: 24
  },
  community: {
    padding: 20,
  },
  root: {
    padding: theme.spacing(2),
  },
  centered: {
    textAlign: 'center'
  },
  mainHeader: {
    marginTop: 36,
    marginBottom: 24
  },
  textHeader: {
    marginTop: 24,
    marginBottom: 12
  },
  info: {
    marginBottom: 12,
    fontSize: "1.3em"
  },
  biggerText: {
    fontSize: "1.6em"
  },
  marginTop: {
    marginTop: 20
  },
  disclaimer: {
    fontSize: "1em"
  },
  strong: {
    fontWeight: 'bold',
  },
  cover: {
    width: '100%',
  },
  imageRight: {
    width: '100%',
    marginBottom: 12,
    [theme.breakpoints.up('sm')]: {
      maxWidth: 280,
      float: 'right',
      marginLeft: 12,
    },
  },
  ALLogo: {
    width: '100%',
    padding: '0 10px',
    [theme.breakpoints.up('sm')]: {
      width: '400px'
    },
  },
  textDivider: {
    marginTop: 24,
    marginBottom: 24,
  },
  home: {
    padding: 10,
  }
});


@withStyles(styles, { withTheme: true })
@inject('portalStore') @observer
class Home extends React.Component {

  render() {
    const {classes} = this.props;

    return (
      <div className={classes.container}>
        <Grid container>
          <Grid item xs={12} md={8} lg={9}>
          {this.props.portalStore.currentUser ? (
            <div className={classes.home}>
                <CurrentUserGamesList/>
                {this.props.portalStore.currentUser.isDM && (
                  <Fragment>
                    <CurrentDMGamesList/>
                  </Fragment>
                )}
            </div>
          ) : (
            <div className={classes.root}>
              <div className={classes.centered}>
                <Typography variant="h4" className={classes.mainHeader}>
                  Witamy w Organized Play Kraków!
                </Typography>
              </div>
              <Typography variant="body1" className={classNames(classes.info)}>
                <strong>Organized Play Kraków (w skrócie OPK)</strong> to społeczność,
                która umożliwia krakowskim miłośnikom D&amp;D - najpopularniejszej na świecie gry fabularnej - bezpłatne
                uczestniczenie w sesjach bez potrzeby skomplikowanego zgrywania terminów oraz podejmowania
                długoterminowych zobowiązań.&nbsp;
                <strong>Nasza społeczność skierowana jest zarówno do weteranów, jak i początkujących graczy.</strong>&nbsp;
                Wzorując się w dużym stopniu na koncepcji Adventurers League, nasi gracze, Mistrzynie i Mistrzowie
                Podziemi rozgrywają różnorodne przygody w stale zmieniających się drużynach. Wszyscy,
                którzy dbają o sympatyczną atmosferę przy stole i dobrą zabawę współgraczy są u nas mile widziani!

              </Typography>
              <Typography variant="body1" className={classes.info}>
                <strong>System rozgrywek OPK nie jest skomplikowany.</strong> Nasze Mistrzynie oraz Mistrzowie Podziemi ogłaszają
                terminy sesji, oraz dopuszczalne poziomy postaci, które w danej sesji mogą uczestniczyć, a gracze
                po prostu się na nie zapisują w sposób ograniczony tylko ilością miejsca przy stole. Chociaż wiele
                z rozgrywanych u nas przygód łączy się w pewne cykle fabularne, każda z nich stanowi zamkniętą historię.
                Kolejne przygody niekoniecznie są ze sobą powiązane, jednak łącznikiem między nimi stają
                się uczestniczący w nich bohaterowie. Każda postać uczestnika OPK zaczyna na pierwszym poziomie
                jako początkujący awanturnik, ale w miarę pokonywania kolejnych przeciwności nabiera barwy i historii,
                nawiązuje relacje z innymi postaciami oraz zdobywa coraz potężniejszy ekwipunek i rozwija
                się mechanicznie.
              </Typography>

              <img src={cover} className={classes.cover}/>

              <Typography variant="body1" className={classNames(classes.info, classes.marginTop)}>
                Nasze sesje prowadzone są według oficjalnych zasad 5 edycji systemu Dungeons & Dragons®.
                Najczęściej gramy w <a href="https://goo.gl/maps/vZBcutQYdH4EfBFL9">R'lyeh Cafe w pobliżu krakowskiego Dworca Głównego</a>,&nbsp;
                aczkolwiek zdarzają się również sesje online <a href="https://discord.gg/BWYKVxk">na naszym serwerze Discord</a>.
              </Typography>
              <Typography variant="body1" className={classes.info}>
                <strong>U nas wystarczy zapisać się na grę i przyjść na sesję w pasującym terminie</strong>.
                Dzięki takiemu podejściu, nikt nie musi rezygnować z gry z powodu braku stałej ekipy, czy też czasu.
                Uczestniczyć można dowolnie często: czy to raz na pół roku, czy też dwa razy na tydzień (choć nie zawsze możemy zagwarantować
                tyle sesji, ile pragnęliby gracze). Jest to również <strong>jedyna w swoim rodzaju okazja na zapoznanie się
                z szerokim gronem graczy oraz różnymi stylami gry i prowadzenia</strong>. Dla starych wyjadaczy, nowinką może
                być konieczność współdziałania w zróżnicowanych drużynach Nigdy nie wiesz, jakie postaci towarzyszy
                Twój bohater napotka na kolejnej sesji.
              </Typography>
              <Typography variant="body1" className={classes.info}>
                <strong>Szczególnie zapraszamy osoby początkujące</strong>, które chciałyby uczestniczyć w swojej pierwszej sesji D&D,
                nauczyć się w praktyce zasad i nawiązać kontakty z krakowską społecznością graczy. Zapewniamy życzliwą
                atmosferę, cierpliwość i świadomość debiutanckich trudności. Chętnie podpowiemy różne rozwiązania,
                pomożemy stworzyć postać i wytłumaczymy wszelkie niejasności.
              </Typography>
              <Typography variant="body1" className={classes.info}>
                <strong>OPK jest też idealnym środowiskiem, by spróbować swoich sił w prowadzeniu przygód</strong> lub udoskonalić
                swoje umiejętności mistrzowania. Bardziej doświadczeni prowadzący chętnie wspomogą dołączających
                do ich grona. Podobnie, jak w przypadku graczy, poprowadzenie przygody nie oznacza żadnych zobowiązań.
                Kolejną możesz poprowadzić za tydzień, albo za kilka miesięcy. I nie przeszkadza to w równoczesnym
                uczestniczeniu w innych sesjach OPK w roli gracza!
              </Typography>
              <Typography variant="body1" className={classes.info}>
                <strong>Dołączcie do naszych stołów</strong>. W tym serwisie możecie się zarejestrować jako
                gracze OPK i zapisać na sesje. Jeśli chcecie dokładniej zapoznać się z zasadami gry i rozwoju postaci
                w OPK – <a target="_blank" href="https://docs.google.com/document/d/1HT_HKIQKt0G-kceR2pzLUHKfyrnXVdwBUXl6qOLl9cI/edit?usp=sharing">
                możecie je zobaczyć w osobnym dokumencie</a>. Zapraszamy też do aktywnego
                udziału w życiu społeczności <a target="_blank" href="https://discord.gg/BWYKVxk">na naszym Discordzie</a> oraz
                na <a target="_blank" href="https://www.facebook.com/groups/ALKrakow/">grupie w serwisie Facebook</a>.
              </Typography>
              <Divider className={classes.textDivider}/>
              <Typography variant="body1" className={classNames(classes.info, classes.centered, classes.biggerText)}>
                <strong>NASTĘPNY KROK?</strong><br/>
              </Typography>
              <Typography variant="body1" className={classNames(classes.info, classes.centered)}>
                <Link to="/poradnik-pierwsza-sesja"><strong>Przeczytaj, jak zagrać swoją pierwszą sesję w OPK</strong></Link>
              </Typography>

              <Divider className={classes.textDivider}/>
              <Typography variant="body1" className={classNames(classes.info, classes.centered, classes.disclaimer)}>
                This website is not affiliated with, endorsed, sponsored, or specifically approved
                by Wizards of the Coast LLC. This (Web site) may use the trademarks and other intellectual
                property of Wizards of the Coast LLC, which is permitted under Wizards'
                &nbsp;<a href="https://company.wizards.com/en/legal/fancontentpolicy">Fan Site Policy</a>.
                For example, Dungeons & Dragons® is a trademark(s) of Wizards of the Coast. For more information
                about Wizards of the Coast or any of Wizards' trademarks or other intellectual property,
                please visit their website at (www.wizards.com).
              </Typography>
              <Divider className={classes.textDivider}/>
              <Typography variant="body1" className={classNames(classes.info, classes.centered)}>
                <strong>Organized Play Kraków</strong> is proudly hosted by <a href="http://toady.org" onClick={openUrl}>Toady - the interactive DM screen for 5e</a>.
              </Typography>
            </div>
          )}
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <div className={classes.community}>
              <Typography variant="h5">
                Join our community
              </Typography>
              <List component="nav">

                <ListItem button onClick={() => window.open('https://www.facebook.com/groups/ALKrakow/')}>
                  <ListItemIcon className={classes.communityIcon}>
                    <FontAwesomeIcon icon={["fab","facebook"]}/>
                  </ListItemIcon>
                  <ListItemText primary="Facebook Group">
                  </ListItemText>
                </ListItem>

                <ListItem button onClick={() => window.open('https://discord.gg/BWYKVxk')}>
                  <ListItemIcon className={classes.communityIcon}>
                    <FontAwesomeIcon icon={["fab","discord"]} />
                  </ListItemIcon>
                  <ListItemText primary="Discord Server">
                  </ListItemText>
                </ListItem>
              </List>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Home;

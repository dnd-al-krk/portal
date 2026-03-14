import React from "react";
import Typography from "@material-ui/core/Typography/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import {Link} from "react-router-dom";
import ExternalLink from "./ExternalLink";


const styles = (theme) => ({
  root: {
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(16),
    paddingRight: theme.spacing(16),
  },
  header: {
    marginBottom: theme.spacing(4),
  },
  text: {
    marginBottom: theme.spacing(2),
    fontSize: "1.4em"
  }
});


@withStyles(styles, {withTheme:true})
class FirstGame extends React.Component {
  render() {
    const {classes} = this.props;

    return (
      <div className={classes.root}>
        <Typography variant="h2" className={classes.header}>
          Poradnik: Twoja pierwsza sesja w OPK
        </Typography>
        <Typography variant="body1" className={classes.text}>
          <strong>Nie można grać w D&D, nie mając swojej postaci.</strong>
        </Typography>
        <Typography variant="body1" className={classes.text}>
          Przygotuj postać poziomu 1, zgodnie z podstawowymi regułami z roku 2014,
          które można znaleźć na <ExternalLink url="https://www.dndbeyond.com/sources/dnd/basic-rules-2014">stronie Wizards of the Coast</ExternalLink>.
          Stosujemy zasady <strong>Point Buy i Starting Equipment</strong>
          (nie losujemy statystyk ani startowego złota!) – szczegółowe objaśnienia znajdziesz w pliku z zasadami OPK,
          ale <strong>postaci oparte na podstawowych regułach i Podręczniku Gracza/Player’s Handbook z roku 2014 (PHB 2014) są zawsze dozwolone.</strong>{' '}
          Nie musisz znać wszystkich zasad by zagrać.
        </Typography>
        <Typography variant="body1" className={classes.text}>
          Mistrz Gry wyjaśni i poprowadzi cię przez rozgrywkę. Na początek wystarczy zapoznać się z rozdziałami 1-4
          oraz 7-9 (ewentualnie 10, jeśli chcesz grać postacią używającą zaklęć) podstawowych reguł, ale większość
          nauki zasad odbywa się przez praktykę. Nie przejmuj się zanadto początkowymi wyborami: według reguł OPK
          do poziomu 5 możesz niemal dowolnie przebudowywać swoją postać, by dopasować ją do swoich oczekiwań.
        </Typography>
        <Typography variant="body1" className={classes.text}>
          Jeśli podczas tworzenia postaci masz jakiekolwiek problemy lub wątpliwości napisz na
          {' '}<ExternalLink url="https://discord.gg/tfnyPWF4Jf">Discordzie OPK w kanale <strong>#tworzenie-postaci</strong></ExternalLink>{' '}
          prośbę o to, żeby ktoś ci pomógł taką postać przygotować. Zresztą, nawet jeśli umiesz stworzyć postać sam,
          warto na wszelki wypadek zapytać, czy jest ona stworzona w sposób zgodny z regułami OPK
          (szkoda marnować na to czas swój i pozostałych graczy podczas sesji).
        </Typography>
        <Typography variant="body1" className={classes.text}>
          Następnie, załóż konto na naszym portalu i dodaj swoją postać. Konto to pozwoli ci przeglądać dostępne
          rozgrywki oraz postaci własne i innych graczy.
        </Typography>
        <Typography variant="body1" className={classes.text}>
          Znajdź dogodny dla siebie termin w zakładce <Link to="/games">Next Game Sessions</Link> oznaczony <strong>Tier 1</strong> (szczebel pierwszy,
          postaci 1-4 poziomu) i zajmij w nim miejsce przyciskiem <strong>Join Game</strong>.<br/>
          <strong>To takie proste!</strong>
        </Typography>
        <Typography variant="body1" className={classes.text}>
          Nie, nie musisz nikogo uprzedzać. Nie musisz pytać o zdanie ani o pozwolenie. Za nic nie musisz płacić
          (choć dobrym zwyczajem jest zamawianie czegoś przy barze pubu, który udostępnia nam stoliki na spotkania).
          Po prostu zapisz się i przyjdź. Prawie wszystkie sesje odbywają się w <ExternalLink url="https://maps.app.goo.gl/ow6bB7KWjhC1Yc787">R’lyeh Cafe, na ulicy Lubicz 28</ExternalLink> w Krakowie, w godzinach podanych przy konkretnej sesji (zazwyczaj po 17 w tygodniu i po 13 w weekendy).
          Gdy się już wciągniesz, zapoznaj się z oficjalnymi podręcznikami i rozwijaj zgodnie z nimi swoje postaci.
          Cały bogaty świat D&D masz na wyciągnięcie ręki.
          <ExternalLink url="https://zasady.rpgkrakow.pl/">Tutaj możesz zapoznać się z naszymi zasadami- na pierwszą sesję wystarczy Ci wiedza o tworzeniu postaci z zasad podstawowych.</ExternalLink>
        </Typography>
        <Typography variant="body1" className={classes.text}>
          <strong>Masz ochotę zostać DM-em?</strong><br/>
          Zgłoś chęć poprowadzenia rozgrywki w OPK na discordzie, a po krótkiej weryfikacji otrzymasz dostęp
          do materiałów i prawo do zakładania stolików. Prowadzenie jest prostsze niż się wydaje!
        </Typography>
        <Typography variant="body1" className={classes.text}>
          <strong>Do zobaczenia na sesjach!</strong>
        </Typography>
      </div>
    )
  }
}

export default FirstGame;

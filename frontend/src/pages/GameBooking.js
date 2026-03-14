import React, {
    Component
} from 'react';
import Typography from "@material-ui/core/Typography";
import {
    NarrowContent,
    WideContent
} from "../common/Content";
import Spinner from "../common/LoadingDiv";
import Grid from '@material-ui/core/Grid';
import withStyles from "@material-ui/core/styles/withStyles";
import {
    inject,
    observer
} from "mobx-react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import classNames from 'classnames';
import LocationIcon from '@material-ui/icons/LocationOn';
import CalendarIcon from '@material-ui/icons/CalendarToday';
import {
    dateToString,
    weekdayOf
} from "../utils";
import Autocomplete from '@material-ui/lab/Autocomplete'

//game booking page /games/game/[session-hash]/book
const styles = theme => ({
    header: {
        marginBottom: theme.spacing(1),
    },
    subheader: {
        marginBottom: theme.spacing(4),
    },
    info: {
        marginRight: theme.spacing(2),
        marginBottom: theme.spacing(4)
    },
    infoIcon: {
        fontSize: 14,
        marginRight: 5,
    },
    textField: {
        width: '100%',
    }
});

@withStyles(styles, {
    withTheme: true
})
@inject('portalStore') @observer
class GameBooking extends Component {

    state = {
        adventures: [],
        adventure_name: '',
        adventure_id: '',
        startTime: '',
        endTime: '',
        spots: 0,
        gameID: null,
        game: null,
        notes: '',
        loading: true,
        formValid: false,
        gameAlreadyBooked: false,
        errors: {},
    };

    componentDidMount() {
        this.setState({
            loading: true,
        });
        Promise.all([this.getGame(), this.fetchAdventures()]).then((data) => {
            this.setState({
                loading: false,
            })
        });
    }

    getGame = () => {
        return this.props.portalStore.games.get(this.props.match.params.id).then(game => {
            if (game.adventure) {
                if (game.dm && game.dm.id !== this.props.portalStore.currentUser.profileID) {
                    this.setState({
                        gameAlreadyBooked: true,
                    })
                } else {
                    this.setState({
                        startTime: game.time_start,
                        endTime: game.time_end,
                        spots: game.spots,
                        gameID: this.props.match.params.id,
                        game: game,
                        adventure_id: game.adventure.id,
                        adventure_name: game.adventure.title_display,
                        notes: game.notes,
                        formValid: true,
                    })
                }
            } else {
                this.setState({
                    startTime: game.time_start,
                    spots: game.spots,
                    gameID: this.props.match.params.id,
                    game: game,
                })
            }
        })
    };

    bookGame = (e) => {
        e.preventDefault();
        if (!this.state.formValid)
            return;
        const data = {
            time_start: this.state.startTime,
            time_end: this.state.endTime ? this.state.endTime : null,
            adventure: this.state.adventure_id,
            notes: this.state.notes,
            spots: this.state.spots,
        };
        this.props.portalStore.games.book(this.props.match.params.id, data).then(() => {
            // TODO: Go to the booked game page, but for now simply return to the list
            this.props.history.push(`/games/game/${this.state.game.id}`);
        });
    };

    fetchAdventures = () => {
        return this.props.portalStore.adventures.fetch().then((adventures) => {
            this.setState({
                adventures: adventures,
            })
        });
    };


    handleChange = prop => event => {
        const value = event.target.value;

        this.setState({
            [prop]: value,
        });
        //validate note length
        if (document.getElementById('notes').value.length > 255) {
            this.setState({
                formValid: value == null,
            })
            this.state.errors['notes'] = "Notes can't contain more than 255 characters."
        }

        //validate that neither adv nor start time are empty. Not done by checking state cause it's async and you have to perform one extra action to get validated

        if (document.getElementById('startTime').value !== '' && document.getElementById('adventure_combo_box').value !== '' && document.getElementById('notes').value.length < 255) {
            this.setState({
                formValid: value !== null,
            })

        }


    };

    handleAdventureSelected = (event, value) => {
        if (value) {

            this.setState({
                adventure_id: value.id,
            })

        }
        if (document.getElementById('startTime').value !== '' && document.getElementById('adventure_combo_box').value !== '' && document.getElementById('notes').value.length < 255) {
            this.setState({
                formValid: value !== null,
            })

        }
    }

    handleSpotsChange = event => {
        const new_value = event.target.value;
        if (new_value <= this.state.game.max_spots && new_value > 3)
            this.handleChange('spots')(event);
    };

    gameDate = () => {
        const date = new Date(this.state.game.date);
        const dateString = dateToString(date);
        const day = weekdayOf(date);
        return `${dateString}, ${day}`;

    };

    render() {
        const {
            classes
        } = this.props;

        if (this.state.loading)
            return ( <
                Spinner loading = {
                    this.state.loading
                }
                />
            );
        else
        if (this.state.gameAlreadyBooked) {
            return ( <
                WideContent >
                <
                Typography variant = "h5"
                className = {
                    classes.header
                } >
                This game is already booked.Sorry!
                <
                /Typography> <
                /WideContent>
            )
        }

        return ( <
            NarrowContent >
            <
            Typography variant = 'h5'
            className = {
                classes.header
            } >
            Booking slot
            for a game <
            /Typography> <
            Typography variant = "body1"
            className = {
                classNames(classes.header, classes.subheader)
            } >
            <
            span className = {
                classes.info
            } >
            <
            CalendarIcon className = {
                classes.infoIcon
            }
            />{this.gameDate()} <
            /span> <
            span className = {
                classes.info
            } >
            <
            LocationIcon className = {
                classes.infoIcon
            }
            /> {this.state.game.table_name} <
            /span> <
            /Typography> <
            form className = {
                classes.container
            }
            onSubmit = {
                this.bookGame
            } >
            <
            Grid container spacing = {
                2
            } >
            <
            Grid item xs = {
                12
            } >
            <
            Autocomplete className = {
                classNames([classes.adventureControl])
            }
            options = {
                this.state.adventures.map(adventure => ({
                    id: adventure.id,
                    name: adventure.title_display
                }))
            }
            getOptionLabel = {
                (option) => option.name
            }
            id = "adventure_combo_box"
            defaultValue = {
                {
                    id: this.state.adventure_id,
                    name: this.state.adventure_name
                }
            }
            disableCloseOnSelect onChange = {
                this.handleAdventureSelected
            }
            renderInput = {
                (params) => < TextField {
                    ...params
                }
                label = "Select adventure"
                variant = "outlined" / >
            }
            /> <
            /Grid> <
            Grid item xs = {
                4
            } >
            <
            TextField id = "startTime"
            label = "Starting time"
            type = "time"
            onChange = {
                this.handleChange('startTime')
            }
            value = {
                this.state.startTime
            }
            variant = "outlined"
            className = {
                classes.textField
            }
            InputLabelProps = {
                {
                    shrink: true,
                }
            }
            inputProps = {
                {
                    step: 900, // 15 min
                }
            }
            /> <
            /Grid> <
            Grid item xs = {
                4
            } >
            <
            TextField id = "endTime"
            label = "Estimated end time"
            type = "time"
            variant = "outlined"
            onChange = {
                this.handleChange('endTime')
            }
            value = {
                this.state.endTime
            }
            className = {
                classes.textField
            }
            InputLabelProps = {
                {
                    shrink: true,
                }
            }
            inputProps = {
                {
                    step: 900, // 15 min
                }
            }
            /> <
            /Grid> <
            Grid item xs = {
                4
            } >
            <
            TextField id = "spots"
            label = "Maximum players spots"
            onChange = {
                this.handleSpotsChange
            }
            type = "number"
            variant = "outlined"
            helperText = {
                `Maximum spots for the table: ${this.state.game.max_spots}`
            }
            value = {
                this.state.spots
            }
            className = {
                classes.textField
            }
            InputLabelProps = {
                {
                    shrink: true,
                }
            }
            /> <
            /Grid> <
            Grid item xs = {
                12
            } >
            <
            TextField id = "notes"
            label = "Notes for players"
            type = "text"
            variant = "outlined"
            value = {
                this.state.notes
            }
            onChange = {
                this.handleChange('notes')
            }
            className = {
                classes.textField
            }
            multiline = {
                true
            }
            InputLabelProps = {
                {
                    shrink: true,
                }
            }
            /> <
            span style = {
                {
                    color: "red"
                }
            } > {
                this.state.errors["notes"]
            } < /span>

            <
            /Grid> <
            Button variant = "contained"
            color = "secondary"
            className = {
                classes.button
            }
            type = 'submit'
            onClick = {
                this.bookGame
            }
            disabled = {
                !this.state.formValid
            } >
            Book game slot <
            /Button> <
            /Grid> <
            /form> <
            /NarrowContent>
        );
    }
}

export default GameBooking;
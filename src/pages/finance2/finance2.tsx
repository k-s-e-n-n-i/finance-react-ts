import React from 'react';
import './finance2.scss';
import FormFinance from '../../components/mui/FormFinance';
// import FormMonth from '../../components/forms/FormMonth';
// import FormTotal from '../../components/FormTotal/FormTotal';

import { withStyles } from '@material-ui/core/styles';
// import Button from '@material-ui/core/Button';
import styles from './style';
import { Button, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: 60,
  lineHeight: '60px',
}));

class Finance2 extends React.Component<{}> {
  render() {
    // const { classes } = this.props;

    return (
      <main className="finance">
        <FormFinance />
        <div className="finance__content-container">
          {/* <div className="finance__forms"> */}
          {/* При добавлении новой формы FormFinance нужно указать name и прописать его в this.state.arrNamesForms FormFinance.tsx */}
          {/* <div className="finance__form-finance">
              <FormFinance name="formFinance" caption="Поступление" colorForm="pink" />
            </div>
            <div className="finance__form-finance">
              <FormFinance name="formAccumulation" caption="" />
            </div>

            <div className="finance__form-finance">
              <FormTotal caption="" />
            </div>

            <div className="finance__form-finance">
              <FormFinance name="formExpenses" caption="Расходы" colorForm="blue" />
            </div>
            <div className="finance__form-finance finance__form-finance_right">
              <FormMonth colorForm="blue" caption="Расходы" />
            </div> */}
          {/* </div> */}
        </div>
      </main>
    );
  }
}

// export default Finance2;

export default withStyles(styles)(Finance2);

import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'

import './index.css'

const apiStatusText = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class CowinDashboard extends Component {
  state = {
    apiStatus: apiStatusText.initial,
    last7DaysVaccination: [],
    byAge: [],
    byGender: [],
  }

  componentDidMount() {
    this.getVaccinationDetails()
    this.setState({apiStatus: apiStatusText.loading})
  }

  getVaccinationDetails = async () => {
    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(url)
    if (response.ok) {
      const fetchedData = await response.json()
      this.setState({
        last7DaysVaccination: fetchedData.last_7_days_vaccination,
        byAge: fetchedData.vaccination_by_age,
        byGender: fetchedData.vaccination_by_gender,
        apiStatus: apiStatusText.success,
      })
    } else {
      this.setState({apiStatus: apiStatusText.failure})
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="loading-container">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderDashBoards = () => {
    const {last7DaysVaccination, byAge, byGender} = this.state
    console.log(last7DaysVaccination)
    return (
      <div className="dashBoard-container">
        <VaccinationCoverage data={last7DaysVaccination} />
        <VaccinationByGender data={byGender} />
        <VaccinationByAge data={byAge} />
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png "
        alt="failure view"
        className="failure-image"
      />
      <h1 className="error-text">Something went wrong</h1>
    </div>
  )

  renderVaccinationDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusText.success:
        return this.renderDashBoards()
      case apiStatusText.loading:
        return this.renderLoadingView()
      case apiStatusText.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="bg-container">
        <div className="content">
          <div className="logo-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png "
              className="logo"
              alt="website logo"
            />
            <h1 className="name">Co-WIN</h1>
          </div>
          <h1 className="description">CoWIN Vaccination in India</h1>
          {this.renderVaccinationDetails()}
        </div>
      </div>
    )
  }
}

export default CowinDashboard

import React from 'react'
import PropTypes from 'prop-types'
import createClass from 'create-react-class'
import createVisualization from '../createVisualization'

export default createClass({
	propTypes: {
		data: PropTypes.object,
		onHover: PropTypes.func,
		onRender: PropTypes.func,
		onUnhover: PropTypes.func,
	},

	componentDidMount() {
		if (this.props.data) {
			this.createChart(this.props.data)
		}
	},

	componentDidUpdate(prevProps) {
		if (this.props.data && this.props.data !== prevProps.data) {
			this.createChart(this.props.data)
		}
	},

	createChart(root) {
		let details = createVisualization({
			svgElement: this.refs.svg,
			root,
			onHover: this.props.onHover,
			onUnhover: this.props.onUnhover,
		})

		if (this.props.onRender) {
			this.props.onRender(details)
		}
	},

	render() {
		if (!this.props.data) {
			return null
		}

		// eslint-disable-next-line brace-style
		return <svg ref="svg" />
	},
})

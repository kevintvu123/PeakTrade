import { useState } from "react"

import styles from "./cssModules/NewSearch.module.css"
import { FaSearch } from "react-icons/fa"

export default function NewSearch() {
    const [input, setInput] = useState("")
    const [results, setResults] = useState([])

    const fetchData = (value) => {
        const apiKey = process.env.REACT_APP_API_KEY
        if (value.length) {
            fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${value}&apikey=${apiKey}`)
                .then((response) => response.json())
                .then((json) => {
                    setResults(json.bestMatches)
                    console.log(results)
                })
        } else {
            setResults([])
        }
    }

    const handleChange = (value) => {
        setInput(value)
        fetchData(value)
    }

    return (
        <div className={styles.searchBarContainer}>
            <div className={styles.inputWrapper}>
                <FaSearch className={styles.searchIcon} />
                <input placeholder="Search" value={input} onChange={(e) => handleChange(e.target.value)} />
            </div>
            {!!results.length &&
                <div className={styles.resultsList}>
                    {
                        results.map((result) => {
                            return <div key={result['1. symbol']}>{result['1. symbol']}</div>
                        })
                    }
                </div>
            }
        </div>
    )

}
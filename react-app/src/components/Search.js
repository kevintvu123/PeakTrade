import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"

import styles from "./cssModules/Searchbar.module.css"
import searchIcon from '../assets/search-icon.png'

export default function Search() {
    const history = useHistory()

    const [keyword, setKeyword] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [inputStatus, setInputStatus] = useState(false)
    const [enterDivStatus, setEnterDivStatus] = useState(false)

    const fetchData = (value) => {
        const apiKey = process.env.REACT_APP_API_KEY
        if (value.length) {
            fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${value}&apikey=${apiKey}`)
                .then(res => res.json())
                .then((result) => {
                    setSearchResults(result.bestMatches)
                })
        } else {
            setSearchResults([])
        }
    }

    const handleChange = (value) => {
        setKeyword(value)
        fetchData(value)
    }

    const redirectStockDetail = (stockTicker) => {
        history.push(`/stocks/${stockTicker}`)
        setSearchResults([])
        setKeyword('')
    }

    //filters stocks with period in ticker b/c there is no result on detail page
    const filteredStocks = searchResults?.filter(stock => !stock['1. symbol'].includes('.'))

    return (
        <div className={styles.searchBarDiv}>
            <div className={styles.searchInputs}>
                <div className={styles.searchIcon}>
                    <img src={searchIcon} alt="search icon" />
                </div>
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder="Search"
                    onBlur={() => {
                        if (!enterDivStatus) {
                            setInputStatus(false)
                        }
                    }}
                    onFocus={() => setInputStatus(true)}
                />
            </div>
            {!!keyword.length && inputStatus &&
                <div className={styles.searchResults} onMouseEnter={() => setEnterDivStatus(true)} onMouseLeave={() => setEnterDivStatus(false)}>
                    {(!!filteredStocks.length) && (
                        filteredStocks.map((result) => {
                            return (
                                <div key={result['1. symbol']} className={styles.eachSearchResult} onClick={() => redirectStockDetail(result['1. symbol'])}>
                                    <div>{result['1. symbol']}</div>
                                    <div>{result['2. name']}</div>
                                </div>
                            )
                        })
                    )}
                </div>
            }
        </div>
    )
}
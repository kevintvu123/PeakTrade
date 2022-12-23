import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import styles from "./cssModules/Searchbar.module.css"



export default function Search() {
    const history = useHistory()

    const [keyword, setKeyword] = useState('')
    const [searchResults, setSearchResults] = useState([])

    const apiKey = process.env.REACT_APP_API_KEY
    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=${apiKey}`

    useEffect(() => {
        if (keyword.length) {
            fetch(url)
                .then(res => res.json())
                .then((result) => {
                    setSearchResults(result.bestMatches)
                })
        } else {
            setSearchResults([])
        }
    }, [keyword, url])

    const redirectStockDetail = (stockTicker) => {
        history.push(`/stocks/${stockTicker}`)
        setSearchResults([])
        setKeyword('')
    }

    return (
        <div className={styles.searchBarDiv}>
            <div className={styles.searchInputs}>
                <div className={styles.searchIcon}>

                </div>
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Search"
                />
            </div>
            <div className={styles.searchResults}>
                {(!!searchResults.length) && (
                    searchResults.map((result) => {
                        return (
                            <div key={result['1. symbol']} className={styles.eachSearchResult} onClick={() => redirectStockDetail(result['1. symbol'])}>
                                <div>{result['1. symbol']}</div>
                                <div>{result['2. name']}</div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
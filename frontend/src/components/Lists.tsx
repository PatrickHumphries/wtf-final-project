import "./Lists.css";

import { Button, Modal } from "react-bootstrap";
import { Link, useHistory, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../context/auth-context";
import { FavoriteButton } from "./FavoriteButton";
import FoodTruckCard from "./FoodTruckCard";
import { Truck } from "../model/dbModel";
import { getTruckData } from "../service/WtfApiService";

interface Props {
    trucks: Truck[];
}

export function Lists( { trucks }: Props ) {
    const { user } = useContext( AuthContext );
    const [ foodTruck, setFoodTruck ] = useState<Truck | null>( null );
    const [ foodTrucksLoaded, setFoodTrucksLoaded ] = useState( false );
    const [ foodTrucks, setFoodTrucks ] = useState<Truck[]>( [] );

    function timeSinceLastPhoto( truck: Truck ) {
        const truckTimestamp: any = truck.lastLocation.timestamp;
        const currentTimestamp = Math.round( new Date().getTime() / 1000 );
        let timeDiffSeconds = currentTimestamp - truckTimestamp;
        let hours = ( timeDiffSeconds / 60 ) / 60;
        let days = Math.round( hours / 24 );
        if ( hours > 24 ) {
            return `${ days } days ago`;
        }
        return `${ hours } hours ago`;
    }

    const openModal = ( truck: Truck ): void => setFoodTruck( truck );
    const closeModal = () => setFoodTruck( null );

    return (
        <div className="container">
            <div className="FoodTruckList">
                <header>
                    <h1>Food Trucks</h1>
                </header>
                <Link to="/">
                    <button id="mapViewTop">Map View</button>
                </Link>
                { !foodTrucksLoaded ? (
                    <p id="loading">Loading...</p>
                ) : foodTrucks.length === 0 ? (
                    <p>No Food Trucks available.</p>

                ) : (
                    <div className="listDiv">
                        { foodTrucks.sort( ( a, b ) => ( a.lastLocation.timestamp < b.lastLocation.timestamp ) ? 1 : -1 ).map( ( truckInList ) => (
                            <div key={ truckInList._id } className="truck">

                                <img src={ truckInList.profilePhoto } alt="" />
                                <p id="name">{ truckInList.name }</p>
                                <p id="igHandle">{ `@${ truckInList.instagramHandle }` }</p>
                                <p id="timestamp">{ `Last updated ${ timeSinceLastPhoto( truckInList ) }` }</p>
                                <button onClick={ () => openModal( truckInList ) }>
                                    More Details
                                </button>
                                { user &&
                                    <FavoriteButton truckId={ truckInList.iGId } />
                                }
                            </div>
                        ) ) }
                    </div>
                ) }
                <Modal
                    show={ foodTruck !== null }
                    className="mymodal"
                    overlayClassName="myoverlay"
                    centered
                >
                    { foodTruck !== null && (
                        <FoodTruckCard truck={ foodTruck } handleClose={ closeModal } />
                    ) }
                </Modal>
                <Link to="/">
                    <button id="mapViewBottom">Back</button>
                </Link>

            </div>
            <button id="scrollToTop"><a href="/list"><i className="material-icons">arrow_upward</i></a></button>
        </div >
    );
}
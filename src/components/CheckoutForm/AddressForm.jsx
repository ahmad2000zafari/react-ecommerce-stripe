import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { commerce } from "../../lib/commerce";

const AddressForm = ({ checkoutToken, test }) => {
  const methods = useForm();
  const history = useHistory();

  const [shippingCountries, setShippingCountries] = useState([]);
  const [shippingCountry, setShippingCountry] = useState("");
  const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
  const [shippingSubdivision, setShippingSubdivision] = useState("");
  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingOption, setShippingOption] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [zipCode, setZipCode] = useState("");

  const shippingData = {
    firstName: firstName,
    lastName: lastName,
    address: address,
    city: city,
    email: email,
    zipCode: zipCode,
    country: shippingCountry,
    subdivision: shippingSubdivision,
    shippingOption: shippingOption,
  };

  console.log(checkoutToken);

  const fetchShippingCountries = async (checkoutTokenId) => {
    const { countries } = await commerce.services.localeListShippingCountries(
      checkoutTokenId
    );

    console.log(countries);
    setShippingCountries(countries);
    console.log(shippingCountries);
    setShippingCountry(Object.keys(countries)[0]);
  };

  const fetchSubdivisions = async (countryCode) => {
    const { subdivisions } = await commerce.services.localeListSubdivisions(
      countryCode
    );

    setShippingSubdivisions(subdivisions);
    setShippingSubdivision(Object.keys(subdivisions)[0]);
  };

  const fetchShippingOptions = async (
    checkoutTokenId,
    country,
    stateProvince = null
  ) => {
    const options = await commerce.checkout.getShippingOptions(
      checkoutTokenId,
      { country, region: stateProvince }
    );

    setShippingOptions(options);
    setShippingOption(options[0].id);
  };
  console.log(shippingOptions);

  useEffect(() => {
    fetchShippingCountries(checkoutToken.id);
  }, []);

  useEffect(() => {
    if (shippingCountry) fetchSubdivisions(shippingCountry);
  }, [shippingCountry]);

  useEffect(() => {
    if (shippingSubdivision)
      fetchShippingOptions(
        checkoutToken.id,
        shippingCountry,
        shippingSubdivision
      );
  }, [shippingSubdivision]);

  const onsubmit = (e) => {
    e.preventDefault();
    test(shippingData);
    history.push("/payment");
  };
  return (
    <div className="flex flex-col items-center justify-between m-2 font-bold">
      <form
        className="w-56 sm:w-auto flex flex-col items-center border pt-5"
        onSubmit={onsubmit}
      >
        <h1 className="my-3 text-lg font-black text-center">
          Shipping address
        </h1>
        <div className="flex flex-col items-center justify-between">
          <div className="flex flex-col sm:flex-row sm:space-x-4 justify-between items-center px-3 mb-3 font-semibold">
            <input
              className="border-b m-auto mb-1 pl-1 bg-blue-100"
              type="text"
              id="fname"
              name="fname"
              placeholder="first name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              className="border-b m-auto mb-1 pl-1 bg-blue-100"
              type="text"
              id="flastname"
              name="flastname"
              placeholder="last name"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:space-x-4 justify-between items-center px-5 mb-3">
            <input
              className="border-b m-auto mb-1 pl-1 bg-blue-100"
              type="text"
              id="address"
              name="address"
              placeholder="address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <input
              className="border-b m-auto mb-1 pl-1 bg-blue-100"
              type="text"
              id="email"
              name="email"
              placeholder="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:space-x-4 justify-between items-center px-5">
            <input
              className="border-b m-auto mb-1 pl-1 bg-blue-100"
              type="text"
              id="city"
              name="city"
              placeholder="city"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              className="border-b m-auto mb-1 pl-1 bg-blue-100"
              type="text"
              id="zipcode"
              name="zipcode"
              placeholder="zip / postal code"
              required
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
          </div>
        </div>
        <br />
        <div className="flex flex-col justify-between items-center mb-3">
          <label className="my-1">Shipping Country</label>
          <select
            className="bg-blue-100"
            value={shippingCountry}
            onChange={(e) => setShippingCountry(e.target.value)}
          >
            {Object.entries(shippingCountries)
              .map(([code, name]) => ({ id: code, label: name }))
              .map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
          </select>
        </div>
        <div className="flex flex-col justify-between items-center mb-3">
          <label className="my-1">Shipping Subdivision</label>
          <select
            className="bg-blue-100"
            value={shippingSubdivision}
            onChange={(e) => setShippingSubdivision(e.target.value)}
          >
            {Object.entries(shippingSubdivisions)
              .map(([code, name]) => ({ id: code, label: name }))
              .map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
          </select>
        </div>
        <div className="flex flex-col justify-between items-center mb-3">
          <label className="my-1">Shipping Options</label>
          <select
            className="bg-blue-100"
            value={shippingOption}
            onChange={(e) => setShippingOption(e.target.value)}
          >
            {shippingOptions
              .map((sO) => ({
                id: sO.id,
                label: `${sO.description} - (${sO.price.formatted_with_symbol})`,
              }))
              .map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
          </select>
        </div>
        <br />
        <div className="py-5 text-white flex flex-row sm:justify-between items-center sm:px-20 mb-10 font-bold space-x-2">
          <button
            type="button"
            className="border rounded bg-gray-300 px-5 font-bold"
            onClick={() => history.push("/cart")}
          >
            Back
          </button>

          <button
            type="submit"
            className="border rounded bg-blue-800 px-5 font-bold"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;

import { useState } from 'react';
import Header from './components/Header';
import Todos from './components/Todos';
import Footer from './components/Footer';

export default function app() {
    return (
        <>
            <Header title="Company Name" secrchBaar={false} />
            <Todos />
            <Footer />
        </>
    );
}

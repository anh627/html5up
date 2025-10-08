/* Click hint overlay */
.phet-simulation {
    cursor: pointer;
    position: relative;
}

.click-hint {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 0.8rem 1.5rem;
    border-radius: var(--radius-md);
    font-size: 1rem;
    font-weight: 600;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    z-index: 5;
}

.phet-simulation:hover .click-hint {
    opacity: 1;
}

/* Overlay effect khi hover */
.phet-simulation::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: var(--radius-lg);
    pointer-events: none;
}

.phet-simulation:hover::before {
    opacity: 1;
}

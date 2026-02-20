import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

/* ================= DEFAULT GLOBAL SETTINGS ================= */

const DEFAULT_SETTINGS = {
    defaults: {
        duration: 60,
        totalMarks: 100
    },

    visuals: {
        orientation: "portrait",
        bgImage: null,
        watermarkType: "none", // none | text | image | logo
        watermarkText: "",
        watermarkImage: null,
        watermarkOpacity: 0.1
    },

    attemptRules: {
        maxAttempts: 1,
        evaluationStrategy: "highest" // highest | latest | average
    },

    behavior: {
        autoSubmit: true,
        shuffleQuestions: true,
        shuffleOptions: true,
        disconnectBehavior: "continue_timer", // continue_timer | pause_timer
        violationHandling: "warning", // warning | auto_submit | terminate
        maxViolations: 3,
        actionAfterMaxViolations: "terminate" // auto_submit | terminate
    },

    grading: {
        scoreType: "marks", // marks | percentage
        resultVisibility: "immediate", // immediate | after_end | manual
        allowReview: true,
        showCorrectAnswers: false,
        enableNegativeMarking: false,
        negativeMarksPerWrong: 0,
        gradeScale: [
            { grade: "A+", min: 90, max: 100 },
            { grade: "A", min: 75, max: 89 },
            { grade: "B", min: 60, max: 74 },
            { grade: "C", min: 40, max: 59 },
            { grade: "F", min: 0, max: 39 }
        ]
    },

    passCriteria: {
        type: "marks" // marks | grade
    },

    proctoring: {
        defaultEnabled: false,
        noiseDetection: false,
        screenMonitoring: false,
        fullScreen: true,
        autoRedirect: true
    },

    instructions: {
        liveExamInstructions:
            "This is a live, time-bound exam. The exam will be auto-submitted when time ends. Do not switch tabs or exit full screen.",
        learnerConsentText:
            "I agree to follow all exam rules and understand violations may lead to disqualification."
    }
};

/* ================= COMPONENT ================= */

const ExamSettings = () => {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);

    // Load saved global settings
    useEffect(() => {
        try {
            const saved = localStorage.getItem("exam_global_settings");
            if (saved) {
                const parsed = JSON.parse(saved);
                // Deep merge with defaults to ensure new keys exist
                setSettings(prev => ({
                    ...prev,
                    ...parsed,
                    defaults: { ...prev.defaults, ...parsed.defaults },
                    visuals: { ...prev.visuals, ...parsed.visuals },
                    attemptRules: { ...prev.attemptRules, ...parsed.attemptRules },
                    behavior: { ...prev.behavior, ...parsed.behavior },
                    grading: {
                        ...prev.grading,
                        ...parsed.grading,
                        gradeScale: parsed.grading?.gradeScale || prev.grading.gradeScale
                    },
                    passCriteria: { ...prev.passCriteria, ...parsed.passCriteria },
                    proctoring: { ...prev.proctoring, ...parsed.proctoring },
                    instructions: { ...prev.instructions, ...parsed.instructions },
                }));
            }
        } catch (error) {
            console.error("Failed to load exam settings:", error);
        }
    }, []);

    // Save global settings
    const handleSave = () => {
        try {
            localStorage.setItem(
                "exam_global_settings",
                JSON.stringify(settings)
            );
            toast.success("Exam settings saved successfully");
        } catch (error) {
            console.error("Save failed:", error);
            if (error.name === 'QuotaExceededError') {
                toast.error("Storage full! Please use smaller images.");
            } else {
                toast.error("Failed to save settings.");
            }
        }
    };

    const handleGradeScaleChange = (index, field, value) => {
        const newScale = [...settings.grading.gradeScale];
        newScale[index][field] = value;
        update(settings, setSettings, "grading.gradeScale", newScale);
    };

    const handleFileChange = (e, key) => {
        const file = e.target.files[0];
        if (file) {
            // Limit to 500KB for localStorage safety
            if (file.size > 500000) {
                toast.error("Image too large for global defaults. Max 500KB.");
                return;
            }
            const reader = new FileReader();
            reader.onload = (ev) => {
                update(settings, setSettings, `visuals.${key}`, ev.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="container py-4" style={{ maxWidth: 900 }}>
            <h3 className="fw-bold mb-1">Exam Settings</h3>
            <p className="text-muted mb-4">
                Global default rules automatically applied to all newly created exams.
            </p>

            {/* -------- EXAM DEFAULTS -------- */}
            <Section title="Exam Defaults">
                <div className="row">
                    <div className="col-md-6">
                        <Input
                            label="Default Duration (Minutes)"
                            type="number"
                            value={settings.defaults.duration}
                            onChange={(v) =>
                                update(settings, setSettings, "defaults.duration", Number(v))
                            }
                        />
                    </div>
                    <div className="col-md-6">
                        <Input
                            label="Default Total Marks"
                            type="number"
                            value={settings.defaults.totalMarks}
                            onChange={(v) =>
                                update(settings, setSettings, "defaults.totalMarks", Number(v))
                            }
                        />
                    </div>
                </div>
            </Section>

            {/* -------- PAPER DESIGN -------- */}
            <Section title="Paper Design (Global Defaults)">
                <div className="row g-4">
                    <div className="col-md-6">
                        <Select
                            label="Default Orientation"
                            value={settings.visuals.orientation}
                            options={[
                                { value: "portrait", label: "Portrait" },
                                { value: "landscape", label: "Landscape" }
                            ]}
                            onChange={(v) =>
                                update(settings, setSettings, "visuals.orientation", v)
                            }
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label small fw-bold">Default Background Image</label>
                        <div className="d-flex gap-2">
                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, "bgImage")}
                            />
                            {settings.visuals.bgImage && (
                                <button
                                    className="btn btn-outline-danger"
                                    onClick={() => update(settings, setSettings, "visuals.bgImage", null)}
                                    title="Remove Image"
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            )}
                        </div>
                        {settings.visuals.bgImage && <div className="text-success x-small mt-1">Image selected</div>}
                        <div className="form-text x-small">Max 500KB. Texture or border recommended.</div>
                    </div>

                    <div className="col-12 border-top pt-3">
                        <div className="row g-3">
                            <div className="col-md-4">
                                <Select
                                    label="Watermark Type"
                                    value={settings.visuals.watermarkType}
                                    options={[
                                        { value: "none", label: "None" },
                                        { value: "logo", label: "Institute Logo" },
                                        { value: "text", label: "Custom Text" },
                                        { value: "image", label: "Custom Image" }
                                    ]}
                                    onChange={(v) =>
                                        update(settings, setSettings, "visuals.watermarkType", v)
                                    }
                                />
                            </div>

                            <div className="col-md-8">
                                {settings.visuals.watermarkType === 'text' && (
                                    <Input
                                        label="Watermark Text"
                                        value={settings.visuals.watermarkText}
                                        onChange={(v) => update(settings, setSettings, "visuals.watermarkText", v)}
                                    />
                                )}

                                {settings.visuals.watermarkType === 'logo' && (
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Institute Logo</label>
                                        <div className="d-flex gap-2">
                                            <input
                                                type="file"
                                                className="form-control"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, "watermarkImage")}
                                            />
                                            {settings.visuals.watermarkImage && (
                                                <button
                                                    className="btn btn-outline-danger"
                                                    onClick={() => update(settings, setSettings, "visuals.watermarkImage", null)}
                                                    title="Remove Image"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            )}
                                        </div>
                                        <div className="form-text x-small">Upload your official institute logo here (Max 500KB).</div>
                                    </div>
                                )}

                                {settings.visuals.watermarkType === 'image' && (
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Watermark Image</label>
                                        <div className="d-flex gap-2">
                                            <input
                                                type="file"
                                                className="form-control"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, "watermarkImage")}
                                            />
                                            {settings.visuals.watermarkImage && (
                                                <button
                                                    className="btn btn-outline-danger"
                                                    onClick={() => update(settings, setSettings, "visuals.watermarkImage", null)}
                                                    title="Remove Image"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            )}
                                        </div>
                                        <div className="form-text x-small">Max 500KB.</div>
                                    </div>
                                )}

                                {settings.visuals.watermarkType !== 'none' && (
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">
                                            Opacity: {Math.round(settings.visuals.watermarkOpacity * 100)}%
                                        </label>
                                        <input
                                            type="range"
                                            className="form-range"
                                            min="0" max="1" step="0.05"
                                            value={settings.visuals.watermarkOpacity}
                                            onChange={(e) => update(settings, setSettings, "visuals.watermarkOpacity", parseFloat(e.target.value))}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* -------- ATTEMPT RULES (NEW) -------- */}
            <Section title="Attempt Rules">
                <div className="row">
                    <div className="col-md-6">
                        <Input
                            label="Max Attempts"
                            type="number"
                            min="1"
                            value={settings.attemptRules.maxAttempts}
                            onChange={(v) =>
                                update(settings, setSettings, "attemptRules.maxAttempts", Number(v))
                            }
                        />
                    </div>
                    <div className="col-md-6">
                        <Select
                            label="Attempt Evaluation Strategy"
                            value={settings.attemptRules.evaluationStrategy}
                            options={[
                                { value: "highest", label: "Best Attempt (Highest Score)" },
                                { value: "latest", label: "Latest Attempt" },
                                { value: "average", label: "Average of All Attempts" }
                            ]}
                            onChange={(v) =>
                                update(settings, setSettings, "attemptRules.evaluationStrategy", v)
                            }
                        />
                    </div>
                </div>
            </Section>

            {/* -------- EXAM BEHAVIOR -------- */}
            <Section title="Exam Behavior & Integrity">
                <Switch
                    label="Auto Submit When Time Ends"
                    checked={settings.behavior.autoSubmit}
                    onChange={(v) =>
                        update(settings, setSettings, "behavior.autoSubmit", v)
                    }
                />

                <div className="row">
                    <div className="col-md-6">
                        <Switch
                            label="Shuffle Questions"
                            checked={settings.behavior.shuffleQuestions}
                            onChange={(v) =>
                                update(settings, setSettings, "behavior.shuffleQuestions", v)
                            }
                        />
                    </div>
                    <div className="col-md-6">
                        <Switch
                            label="Shuffle Options"
                            checked={settings.behavior.shuffleOptions}
                            onChange={(v) =>
                                update(settings, setSettings, "behavior.shuffleOptions", v)
                            }
                        />
                    </div>
                </div>

                <div className="mb-3 border-top pt-3">
                    <label className="form-label small fw-bold text-danger">Integrity Handling</label>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <Select
                                label="On Network Disconnect"
                                value={settings.behavior.disconnectBehavior}
                                options={[
                                    { value: "continue_timer", label: "Continue Timer (Strict)" },
                                    { value: "pause_timer", label: "Pause Timer (Lenient)" }
                                ]}
                                onChange={(v) =>
                                    update(settings, setSettings, "behavior.disconnectBehavior", v)
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <Select
                                label="Violation Handling (Single)"
                                value={settings.behavior.violationHandling}
                                options={[
                                    { value: "warning", label: "Warning Only" },
                                    { value: "auto_submit", label: "Auto Submit Exam" },
                                    { value: "terminate", label: "Terminate Exam" }
                                ]}
                                onChange={(v) =>
                                    update(settings, setSettings, "behavior.violationHandling", v)
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <Input
                                label="Max Allowed Violations"
                                type="number"
                                value={settings.behavior.maxViolations}
                                onChange={(v) =>
                                    update(settings, setSettings, "behavior.maxViolations", Number(v))
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <Select
                                label="Action After Max Violations"
                                value={settings.behavior.actionAfterMaxViolations}
                                options={[
                                    { value: "auto_submit", label: "Auto Submit Exam" },
                                    { value: "terminate", label: "Terminate Exam Immediately" }
                                ]}
                                onChange={(v) =>
                                    update(settings, setSettings, "behavior.actionAfterMaxViolations", v)
                                }
                            />
                        </div>
                    </div>
                </div>
            </Section>

            {/* -------- GRADING RULES -------- */}
            <Section title="Grading & Result Controls">
                <div className="row">
                    <div className="col-md-6">
                        <Select
                            label="Score Calculation Mode"
                            value={settings.grading.scoreType}
                            options={[
                                { value: "marks", label: "Absolute Marks" },
                                { value: "percentage", label: "Percentage (%)" }
                            ]}
                            onChange={(v) =>
                                update(settings, setSettings, "grading.scoreType", v)
                            }
                        />
                    </div>
                    <div className="col-md-6">
                        <Select
                            label="Result Visibility"
                            value={settings.grading.resultVisibility}
                            options={[
                                { value: "immediate", label: "Immediately After Submission" },
                                { value: "after_end", label: "After Exam Ends" },
                                { value: "manual", label: "Manual Release" }
                            ]}
                            onChange={(v) =>
                                update(settings, setSettings, "grading.resultVisibility", v)
                            }
                        />
                    </div>
                </div>

                <div className="row mt-2">
                    <div className="col-md-6">
                        <Switch
                            label="Allow Student to Review Answers"
                            checked={settings.grading.allowReview}
                            onChange={(v) =>
                                update(settings, setSettings, "grading.allowReview", v)
                            }
                        />
                    </div>
                    <div className="col-md-6">
                        <Switch
                            label="Show Correct Answers in Review"
                            checked={settings.grading.showCorrectAnswers}
                            onChange={(v) =>
                                update(settings, setSettings, "grading.showCorrectAnswers", v)
                            }
                        />
                    </div>
                </div>

                <div className="border-top pt-3 mt-2">
                    <Switch
                        label="Enable Negative Marking"
                        checked={settings.grading.enableNegativeMarking}
                        onChange={(v) =>
                            update(settings, setSettings, "grading.enableNegativeMarking", v)
                        }
                    />

                    {settings.grading.enableNegativeMarking && (
                        <Input
                            label="Marks Deducted per Wrong Answer"
                            type="number"
                            step="0.01"
                            value={settings.grading.negativeMarksPerWrong}
                            onChange={(v) =>
                                update(
                                    settings,
                                    setSettings,
                                    "grading.negativeMarksPerWrong",
                                    Number(v)
                                )
                            }
                        />
                    )}
                </div>

                {/* Grade Scale Helper */}
                <div className="mt-4">
                    <label className="form-label small fw-bold">Default Grade Scale (Reference)</label>
                    <div className="table-responsive border rounded p-2 bg-light">
                        <table className="table table-sm table-borderless mb-0 small">
                            <thead>
                                <tr>
                                    <th>Grade</th>
                                    <th>Min (%)</th>
                                    <th>Max (%)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {settings.grading.gradeScale.map((g, idx) => (
                                    <tr key={idx}>
                                        <td><input type="text" className="form-control form-control-sm" style={{ width: 60 }} value={g.grade} onChange={(e) => handleGradeScaleChange(idx, 'grade', e.target.value)} /></td>
                                        <td><input type="number" className="form-control form-control-sm" style={{ width: 70 }} value={g.min} onChange={(e) => handleGradeScaleChange(idx, 'min', parseInt(e.target.value))} /></td>
                                        <td><input type="number" className="form-control form-control-sm" style={{ width: 70 }} value={g.max} onChange={(e) => handleGradeScaleChange(idx, 'max', parseInt(e.target.value))} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Section>

            {/* -------- PROCTORING -------- */}
            <Section title="Security & Proctoring">
                <Switch
                    label="Enable Proctoring by Default"
                    checked={settings.proctoring.defaultEnabled}
                    onChange={(v) =>
                        update(settings, setSettings, "proctoring.defaultEnabled", v)
                    }
                />

                {settings.proctoring.defaultEnabled && (
                    <div className="ps-3 border-start">
                        <Switch
                            label="Background Noise Detection"
                            checked={settings.proctoring.noiseDetection}
                            onChange={(v) =>
                                update(settings, setSettings, "proctoring.noiseDetection", v)
                            }
                        />
                        <Switch
                            label="Screen Monitoring"
                            checked={settings.proctoring.screenMonitoring}
                            onChange={(v) =>
                                update(settings, setSettings, "proctoring.screenMonitoring", v)
                            }
                        />
                        <Switch
                            label="Enforce Full Screen"
                            checked={settings.proctoring.fullScreen}
                            onChange={(v) =>
                                update(settings, setSettings, "proctoring.fullScreen", v)
                            }
                        />
                        <Switch
                            label="Auto Redirect on Violation"
                            checked={settings.proctoring.autoRedirect}
                            onChange={(v) =>
                                update(settings, setSettings, "proctoring.autoRedirect", v)
                            }
                        />
                    </div>
                )}
            </Section>

            {/* -------- LIVE INSTRUCTIONS -------- */}
            <Section title="Live Exam Instructions">
                <div className="mb-3">
                    <label className="form-label small fw-bold">Exam Instructions</label>
                    <textarea
                        className="form-control"
                        rows={6}
                        value={settings.instructions.liveExamInstructions}
                        onChange={(e) =>
                            update(
                                settings,
                                setSettings,
                                "instructions.liveExamInstructions",
                                e.target.value
                            )
                        }
                    />
                </div>
                <div>
                    <label className="form-label small fw-bold">Learner Consent Text (Mandatory Checkbox)</label>
                    <textarea
                        className="form-control"
                        rows={2}
                        value={settings.instructions.learnerConsentText}
                        onChange={(e) =>
                            update(
                                settings,
                                setSettings,
                                "instructions.learnerConsentText",
                                e.target.value
                            )
                        }
                    />
                </div>
            </Section>

            <div className="text-end mt-4 pb-5">
                <button className="btn btn-primary px-4" onClick={handleSave}>
                    Save Exam Settings
                </button>
            </div>
        </div>
    );
};

export default ExamSettings;

/* ================= HELPERS ================= */

const Section = ({ title, children }) => (
    <div className="card mb-4 shadow-sm">
        <div className="card-header fw-bold">{title}</div>
        <div className="card-body">{children}</div>
    </div>
);

const Input = ({ label, onChange, ...props }) => (
    <div className="mb-3">
        <label className="form-label small fw-bold">{label}</label>
        <input
            className="form-control"
            onChange={(e) => onChange(e.target.value)}
            {...props}
        />
    </div>
);

const Switch = ({ label, checked, onChange }) => (
    <div className="form-check form-switch mb-3">
        <input
            className="form-check-input"
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
        />
        <label className="form-check-label small fw-bold">{label}</label>
    </div>
);

const Select = ({ label, value, options, onChange }) => (
    <div className="mb-3">
        <label className="form-label small fw-bold">{label}</label>
        <select
            className="form-select"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            {options.map((o) => (
                <option key={o.value} value={o.value}>
                    {o.label}
                </option>
            ))}
        </select>
    </div>
);

const update = (state, setState, path, value) => {
    setState(prev => {
        const newState = { ...prev };
        const keys = path.split(".");
        let current = newState;

        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            current[key] = { ...current[key] };
            current = current[key];
        }

        current[keys[keys.length - 1]] = value;
        return newState;
    });
};
